import { NextRequest, NextResponse } from 'next/server';
import { queryElasticUsingNaturalLanguage } from '@/lib/queryElasticUsingNaturalLanguage';

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const hitsFromElasticsearch = await queryElasticUsingNaturalLanguage(query);
  console.log(hitsFromElasticsearch);
  return NextResponse.json(hitsFromElasticsearch);
}