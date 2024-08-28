import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { textToSummarize } = body;

	if (!textToSummarize) {
		return NextResponse.json({ error: "Missing textToSummarize parameter" }, { status: 400 });
	};

  try {
		const res = await hf.summarization({
			model: 'facebook/bart-large-cnn',
			inputs: textToSummarize,
		},
		{
			wait_for_model: true
		});

		return NextResponse.json(res);
  } catch (error) {
		console.error("Error processing while the summarization:", error);
		return NextResponse.json({ error: "Error processing while the summarization" }, { status: 500 });
  };
};
