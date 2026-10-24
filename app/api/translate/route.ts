import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, apiKey } = body;

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "Gemini API Key ထည့်ပေးပါ။" },
        { status: 400 }
      );
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "ဘာသာပြန်မယ့် စာသားထည့်ပေးပါ။" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Translate the following text into natural spoken Burmese (Myanmar language). Return only the translated text, without explanations:\n\n" +
                    text,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Gemini API တောင်းဆိုမှု မအောင်မြင်ပါ။",
        },
        { status: response.status }
      );
    }

    const translatedText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("") || "";

    if (!translatedText) {
      return NextResponse.json(
        { error: "ဘာသာပြန်စာသား မရရှိပါ။" },
        { status: 502 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json(
      { error: "Server error ဖြစ်နေပါတယ်။ ထပ်စမ်းကြည့်ပါ။" },
      { status: 500 }
    );
  }
}
