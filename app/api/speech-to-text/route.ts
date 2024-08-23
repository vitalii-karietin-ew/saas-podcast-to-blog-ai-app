import axios from "axios";
import { NextResponse } from "next/server";
import { SummarizationChain, TextTranscriptionChain } from '@/app/chains';

export async function POST(request: Request) {
	const body = await request.json();
	const { audioLink } = body;

	const { data } = await axios.get(audioLink, { responseType: 'arraybuffer' });

  const transcriptionChain = new TextTranscriptionChain();
	const summarizationChain = new SummarizationChain();

	const chains = transcriptionChain.pipe(summarizationChain);

	const res = await chains.invoke({
    audioSource: data
  });

	return NextResponse.json({
		summary: res.text
	});
};