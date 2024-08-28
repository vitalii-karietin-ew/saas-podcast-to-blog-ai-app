import axios from "axios";
import { NextResponse } from "next/server";
import { SummarizationChain, TextTranscriptionChain } from '@/app/chains';

export async function POST(request: Request) {
	const body = await request.json();
	const { audioLink } = body;

	if (!audioLink) {
		return NextResponse.json({ error: "Missing audioLink parameter" }, { status: 400 });
	};

	const { data } = await axios.get(audioLink, { responseType: 'arraybuffer' });

	if (!data) {
		return NextResponse.json({ error: "Error fetching audio file" }, { status: 500 });
	};

	try {
		const transcriptionChain = new TextTranscriptionChain();
		const summarizationChain = new SummarizationChain();
	
		const chains = transcriptionChain.pipe(summarizationChain);
	
		const res = await chains.invoke({
			audioSource: data
		});
	
		return NextResponse.json({
			summary: res.text
		});
	} catch (error) {
		console.error("Error processing while the summarization:", error);
		return NextResponse.json({ error: "Error processing while the summarization" });
	};
};
