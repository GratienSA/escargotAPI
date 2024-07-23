import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nestJsUrl = `${process.env.NEXT_PUBLIC_NEST_API_URL}/checkout`;

    console.log("Sending request to NestJS:", JSON.stringify(body, null, 2));

    const response = await fetch(nestJsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from NestJS server:", errorData);
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in checkout proxy:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}