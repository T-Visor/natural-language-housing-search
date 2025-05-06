import { NextRequest, NextResponse } from 'next/server';
//import { queryElasticUsingNaturalLanguage } from '@/lib/queryElasticUsingNaturalLanguage';
import { queryElasticUsingNaturalLanguage } from '@/lib/buildElasticQuery';

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const hitsFromElasticsearch = await queryElasticUsingNaturalLanguage(query);
  return NextResponse.json(hitsFromElasticsearch);
}