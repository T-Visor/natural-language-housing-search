import { NextRequest, NextResponse } from "next/server";
import { generateElasticQueryFromPrompt } from "@/lib/buildElasticQuery";
import { z } from "zod";
import { Client } from "@elastic/elasticsearch";

const ELASTIC_HITS_SIZE: number = 10;

// Zod schema to validate elastic query structure
const ElasticQuerySchema = z.object({
  query: z.object({}).passthrough(),
});
type ElasticQuery = z.infer<typeof ElasticQuerySchema>;

// In-memory cache (key: prompt string, value: Elasticsearch query)
const queryCache = new Map<string, ElasticQuery>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body?.prompt?.trim();
    const pageNumber = body?.pageNumber;

    if (!prompt) {
      return NextResponse.json({ 
        error: "Missing or empty 'prompt' field" 
      }, { status: 400 });
    }
    if (!pageNumber) {
      return NextResponse.json({
        error: "Missing or empty 'pageNumber' field"
      }, { status: 400 })
    }

    let elasticQuery: ElasticQuery;

    if (queryCache.has(prompt)) {
      console.log(`Cache hit for: "${prompt}"`);
      elasticQuery = queryCache.get(prompt)!;
    }
    else {
      console.log(`Generating and executing query for: "${prompt}"`);
      elasticQuery = await generateElasticQueryFromPrompt(prompt);
      ElasticQuerySchema.parse(elasticQuery);
      queryCache.set(prompt, elasticQuery);
    }

    console.log(JSON.stringify(elasticQuery));

    const start: number = (pageNumber - 1) * ELASTIC_HITS_SIZE;
    return NextResponse.json(await getHitsFromElasticsearch(elasticQuery, start, ELASTIC_HITS_SIZE));
  } 
  catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const getHitsFromElasticsearch = async (
  elasticQuery: ElasticQuery, 
  from: number, 
  size: number
) => {
  const client = new Client({
    node: process.env.ELASTICSEARCH_API_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  });

  const searchResults = await client.search({
    from: from,
    index: "real_estate",
    body: elasticQuery,
    size: size
  }, { meta: true });


  return searchResults.body.hits.hits;
}