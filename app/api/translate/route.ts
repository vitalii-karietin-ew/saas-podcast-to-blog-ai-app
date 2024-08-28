import { NextResponse } from "next/server";
import { TextTranslationChain } from "@/app/chains";

export async function POST(request: Request) {
  const body = await request.json();
  const { textToTranslate } = body;

	if (!textToTranslate) {
		return NextResponse.json({ error: "Missing textToTranslate parameter" }, { status: 400 });
	};

	try {
		const translaion = new TextTranslationChain();
		const response = await translaion.invoke({
			text: textToTranslate,
		});
	
		return NextResponse.json({
			translaion: response.text
		});
	} catch (error) {
		console.error("Error processing while the translation:", error);
		return NextResponse.json({ error: "Error processing while the translation" });
	};
};
