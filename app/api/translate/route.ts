import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { TextTranslationChain } from "@/app/chains";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { textToTranslate } = body;

	const translaion = new TextTranslationChain({});
	const response = await translaion.invoke({
		text: textToTranslate,
	});

	return NextResponse.json({
		translaion: response.text
	});
}