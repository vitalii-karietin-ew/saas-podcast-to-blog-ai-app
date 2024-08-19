import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { textToTranslate } = body;

  try {
		const res = await hf.translation({
			model: "Helsinki-NLP/opus-mt-en-fr",
			inputs: textToTranslate,
		},
		{
			wait_for_model: true
		});

		return NextResponse.json(res);
  } catch (error) {
		console.error("Error processing while the summarization:", error);
		return NextResponse.json({ error: "Error processing while the summarization" });
  }
}