import { NextResponse } from "next/server";
import { ImageGenerationChain, PromptGenerationChain } from "@/app/chains";

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

	if (!prompt) {
		return NextResponse.json({ error: "Missing prompt parameter" }, { status: 400 });
	};

	try {
		const promptGenerationChain = new PromptGenerationChain();
		const imageGenerationChain = new ImageGenerationChain();
	
		const chains = promptGenerationChain.pipe(imageGenerationChain);
	
		const result = await chains.invoke({ text: prompt });
		
		return new NextResponse(result.image);
	} catch(e) {
		console.error("Error generating image:", e);
		return NextResponse.json({ error: "An error occurred while generating image" }, { status: 500 });
	};
};
