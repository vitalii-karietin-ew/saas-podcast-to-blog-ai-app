import { NextResponse } from "next/server";
import { AskQuestionChain, TextTranscriptionChain } from "@/app/chains";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, audioLink, question } = body;

	const transcriptionChain = new TextTranscriptionChain();
	const answerGenerationChain = new AskQuestionChain();

	const { data: audioSource } = await axios.get(audioLink, { responseType: 'arraybuffer' });
	const transcription = await transcriptionChain.invoke({ audioSource });
	
	if (!transcription.text) {
		throw new Error('Transcription failed');
	};

	const result = await answerGenerationChain.invoke({ question: question || messages[messages.length - 1].content, context: transcription.text });
	
	return new NextResponse(result.answer);
}