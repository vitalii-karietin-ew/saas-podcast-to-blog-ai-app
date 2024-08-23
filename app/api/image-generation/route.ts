import { NextResponse } from "next/server";
import { ImageGenerationChain, PromptGenerationChain } from "@/app/chains";

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

	const promptGenerationChain = new PromptGenerationChain();
	const imageGenerationChain = new ImageGenerationChain();

	const chains = promptGenerationChain.pipe(imageGenerationChain);

	const result = await chains.invoke({ text: prompt });
	
	return new NextResponse(result.image);
}