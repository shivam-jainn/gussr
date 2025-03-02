import { NextRequest, NextResponse } from "next/server";
import { decryptCity } from "@/lib/utils";
import { getCityInfo } from "@/lib/database/queries";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const encryptedCity = searchParams.get('q');
        const score = searchParams.get('score');
        const username = searchParams.get('username');

        if (!encryptedCity || !score) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const cityId = decryptCity(encryptedCity);
        if (!cityId) {
            return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
        }

        const cityInfo = await getCityInfo(cityId);
        if (!cityInfo) {
            return NextResponse.json({ error: 'City not found' }, { status: 404 });
        }

        // Generate Open Graph metadata
        const metadata = {
            title: `Gussr - City Guessing Game`,
            description: `${username ? username + ' scored' : 'Someone scored'} ${score}/5 in Gussr! Can you beat their score? 🌎`,
            image: cityInfo.images[0]?.url || '/skyclear.jpg', // Use first city image or fallback
            url: `${req.nextUrl.origin}?${searchParams.toString()}`
        };

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Error generating share metadata:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}