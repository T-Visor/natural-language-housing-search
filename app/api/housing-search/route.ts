import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@elastic/elasticsearch"

const elasticsearchIndex = "real_estate";

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "PO4SXCuy"
  }
});

export async function GET() {
  const result = await client.search({
    index: elasticsearchIndex,
    body: {
      query: {
        "match_all": {}
      }
    }
  });

  return NextResponse.json(result.hits.hits);
}