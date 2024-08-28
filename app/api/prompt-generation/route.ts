import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { input } = body;

	if (!input) {
		return NextResponse.json({ error: "Missing input parameter" }, { status: 400 });
	};

  try {
		const res = await hf.chatCompletion({
			model: "HuggingFaceH4/zephyr-7b-beta",
			messages: [{ role: "user", content: `Generate a prompt for the blog post image related to this text: ${input}` }],
			max_tokens: 500,
		},
		{
			wait_for_model: true
		});

		return NextResponse.json(res);
  } catch (error) {
		console.error("Error processing while the summarization:", error);
		return NextResponse.json({ error: "Error processing while the summarization" });
  };
};
