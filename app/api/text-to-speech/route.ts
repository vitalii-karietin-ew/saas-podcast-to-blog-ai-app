import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { TextToSpeechChain } from "@/app/chains";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { textToSpeech } = body;

  const textToSpeechChain = new TextToSpeechChain();

	const result = await textToSpeechChain.invoke({	text: textToSpeech });

	const response = result.audio;
	return new NextResponse(response);
}