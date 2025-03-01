import { getCityInfo, getQuestion } from "@/lib/database/queries";
import { NextRequest, NextResponse } from "next/server";
import { encryptCity } from "@/lib/utils";

export async function GET() {
    try {
        const result = await getQuestion();

        if (!result) {
            return NextResponse.json({ message: "No questions found" }, { status: 404 });
        }

        const { city, clues, options } = result;

        if (!city) {
            return NextResponse.json({ message: "Invalid question data" }, { status: 500 });
        }

        const encryptedCity = encryptCity(city.id);

        return NextResponse.json({
            encryptedCity,
            clues,
            options
        }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/questions:', error);
        return NextResponse.json(
            { message: "Internal server error" }, 
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    // const userId = req.headers.get('userId');

    // if (!userId) {
    //     return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    // }

    const body = await req.json();
    const cityId = body.cityId;

    if (!cityId) {
        return NextResponse.json({ message: "City ID is required" }, { status: 400 });
    }

    const query_result = await getCityInfo(cityId);

    if (!query_result) {
        return NextResponse.json({ message: "No city info found" }, { status: 404 });
    }

    return NextResponse.json(query_result, { status: 200 });
}