import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const gameId = params.id;
  const gameData = await kv.get(`game:${gameId}`);
  
  if (!gameData) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
  
  return NextResponse.json(gameData);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const gameId = params.id;
  const data = await request.json();
  
  // Store game data with 24h expiration
  await kv.set(`game:${gameId}`, data, { ex: 86400 });
  
  return NextResponse.json({ success: true });
}