import { NextResponse } from 'next/server'
import { searchAllPlants } from '@/data/lib/plant-api-service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'fern'
  
  try {
    const results = await searchAllPlants(query)
    
    // Group results by source
    const groupedResults = {
      local: results.filter(p => p.source === 'local'),
      trefle: results.filter(p => p.source === 'trefle'),
      openfarm: results.filter(p => p.source === 'openfarm')
    }
    
    return NextResponse.json({
      query,
      totalResults: results.length,
      bySource: {
        local: groupedResults.local.length,
        trefle: groupedResults.trefle.length,
        openfarm: groupedResults.openfarm.length
      },
      samples: {
        local: groupedResults.local.slice(0, 2).map(p => p.common_name),
        trefle: groupedResults.trefle.slice(0, 2).map(p => p.common_name),
        openfarm: groupedResults.openfarm.slice(0, 2).map(p => p.common_name)
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to search plants',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}