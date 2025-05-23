import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@elastic/elasticsearch"

const {
  ELASTICSEARCH_API_URL,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  ELASTICSEARCH_INDEX,
} = process.env;

if (!ELASTICSEARCH_API_URL ||
  !ELASTICSEARCH_USERNAME ||
  !ELASTICSEARCH_PASSWORD ||
  !ELASTICSEARCH_INDEX) {
  throw new Error("Missing required environment variables for Elasticsearch client.");
}

const client = new Client({
  node: ELASTICSEARCH_API_URL,
  auth: {
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD,
  },
});

export async function GET() {
  const result = await client.search({
    index: ELASTICSEARCH_INDEX,
    body: {
      "query": {
        "match_all": {}
      },
      size: 30
    }
  });

return NextResponse.json(result.hits.hits);
}