import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { textToSpeech } = body;

  try {
		const res = await hf.textToSpeech({
			model: 'espnet/kan-bayashi_ljspeech_vits',
			inputs: textToSpeech,
		},
		{
			wait_for_model: true
		});
		console.log(res)
		return NextResponse.json(res);
  } catch (error) {
		console.error("Error processing while the summarization:", error);
		return NextResponse.json({ error: "Error processing while the summarization" });
  }
}