import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { } from 'langchain/chains';
import {  } from "@langchain/openai";
import { ImageGenerationChain, PromptGenerationChain, SummarizationChain, TextTranscriptionChain } from "@/app/chains";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  // const body = await request.json();
  // const { audioLink } = body;
  const transcriptionChain = new TextTranscriptionChain({
    callback: (step: string, result: string) => {
      console.log(step, result)
    }
  });
  const summarizationChain = new SummarizationChain();
  const promptGenerationChain = new PromptGenerationChain();
  const imageGenerationChain = new ImageGenerationChain();

  const chains = transcriptionChain
    .pipe(summarizationChain)
    .pipe(promptGenerationChain)
    .pipe(imageGenerationChain);

  const res = chains.invoke({ audioSource: new Blob })

  return NextResponse.json({ res, completed: true })
}