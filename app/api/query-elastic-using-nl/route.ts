import { NextRequest, NextResponse } from "next/server";
import { generateElasticQueryFromPrompt } from "@/lib/buildElasticQuery";
import { z } from "zod";
import { Client } from "@elastic/elasticsearch";

// Zod schema to validate elastic query structure
const ElasticQuerySchema = z.object({
  query: z.object({}).passthrough(),
});
type ElasticQuery = z.infer<typeof ElasticQuerySchema>;

// In-memory cache (key: prompt string, value: search results)
const queryCache = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body?.prompt?.trim(); // changed to "prompt" for clarity

    if (!prompt) {
      return NextResponse.json({ 
        error: "Missing or empty 'prompt' field" 
      }, { status: 400 });
    }

    if (queryCache.has(prompt)) {
      console.log(`🔁 Cache hit for: "${prompt}"`);
      return NextResponse.json(queryCache.get(prompt));
    }

    console.log(`⚙️ Generating and executing query for: "${prompt}"`);
    const generatedElasticQuery: ElasticQuery = await generateElasticQueryFromPrompt(prompt);

    // Validate the structure matches the expected schema
    ElasticQuerySchema.parse(generatedElasticQuery);

    const hitsFromElasticsearch = await executeElasticQuery(generatedElasticQuery);

    // Only cache if no error occurred
    queryCache.set(prompt, hitsFromElasticsearch);

    return NextResponse.json(hitsFromElasticsearch);
  } 
  catch (error: any) {
    console.error("❌ Error processing request:", error);
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