import { NextRequest, NextResponse } from "next/server";
import { generateElasticQueryFromPrompt } from "@/lib/buildElasticQuery";
import { z } from "zod";
import { Client } from "@elastic/elasticsearch";

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

    if (!prompt) {
      return NextResponse.json({ 
        error: "Missing or empty 'prompt' field" 
      }, { status: 400 });
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

    const hitsFromElasticsearch = await executeElasticQuery(elasticQuery);
    return NextResponse.json(hitsFromElasticsearch);
  } 
  catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const executeElasticQuery = async (elasticQuery: ElasticQuery) => {
  const client = new Client({
    node: process.env.ELASTICSEARCH_API_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  });

  const searchResults = await client.search({
    index: "real_estate",
    body: elasticQuery,
    size: 100
  }, { meta: true });

  return searchResults.body.hits.hits;
};