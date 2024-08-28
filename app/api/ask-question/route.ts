import { NextResponse } from "next/server";
import { AskQuestionChain, TextTranscriptionChain } from "@/app/chains";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, audioLink, question } = body;

	if (!messages || !audioLink) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  };

	try {
		const transcriptionChain = new TextTranscriptionChain();
		const answerGenerationChain = new AskQuestionChain();
	
		const { data: audioSource } = await axios.get(audioLink, { responseType: 'arraybuffer' });
		const transcription = await transcriptionChain.invoke({ audioSource });
		
		if (!transcription.text) {
			return NextResponse.json("Transcription failed");
		};
	
		const result = await answerGenerationChain.invoke({ question: question || messages[messages.length - 1].content, context: transcription.text });
		
		return new NextResponse(result.answer);
	} catch(e) {
		console.error("Error processing question:", e);
		return NextResponse.json({ error: "An error occurred while processing question" }, { status: 500 });
	}
}