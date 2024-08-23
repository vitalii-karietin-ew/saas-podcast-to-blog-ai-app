import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { } from 'langchain/chains';
import {  } from "@langchain/openai";
import { ImageGenerationChain, PromptGenerationChain, SummarizationChain, TextToSpeechChain, TextTranscriptionChain } from "@/app/chains";
import axios from "axios";
import { text } from "stream/consumers";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request, response: NextResponse) {
  const body = await request.json();
  const { audioLink } = body;

  // using axios fetch the audio file in the BufferArray from the audioLink
  const { data } = await axios.get(audioLink, { responseType: 'arraybuffer' });
  // const audioBlob = new Blob([audioBuffer.data], { type: 'audio/mpeg' });

  const transcriptionChain = new TextTranscriptionChain();
  const summarizationChain = new SummarizationChain();
  const textToSpeechChain = new TextToSpeechChain();
  const promptGenerationChain = new PromptGenerationChain();
  const imageGenerationChain = new ImageGenerationChain();

  const chains = transcriptionChain.withConfig({
      callbacks: [
        {
          handleChainEnd(outputs, runId, parentRunId, tags, kwargs) {
            console.log("transcriptionChain ------------------")
            console.log("outputs", outputs)
            console.log("runId", runId)
            console.log("parentRunId", parentRunId)
            console.log("tags", tags)
            console.log("kwargs", kwargs)
          },
        }
      ]
    })
    .pipe(summarizationChain).withConfig({
      callbacks: [
        {
          handleChainEnd(outputs, runId, parentRunId, tags, kwargs) {
            NextResponse.json(outputs, { headers: { 'Content-Type': 'application/octet-stream' } })
            console.log("summarizationChain ------------------")
            console.log("outputs", outputs)
            console.log("runId", runId)
            console.log("parentRunId", parentRunId)
            console.log("tags", tags)
            console.log("kwargs", kwargs)
          },
        }
      ]
    })
    .pipe(textToSpeechChain).withConfig({
      callbacks: [
        {
          handleChainEnd(outputs, runId, parentRunId, tags, kwargs) {
            console.log("textToSpeechChain ------------------")
            console.log("outputs", outputs)
            console.log("runId", runId)
            console.log("parentRunId", parentRunId)
            console.log("tags", tags)
            console.log("kwargs", kwargs)
          },
        }
      ]
    })
    // .pipe(promptGenerationChain)
    // .pipe(imageGenerationChain);

  const res = await chains.invoke({
    audioSource: data
  });

  console.log("res", res);

  return NextResponse.json({
    text: res.text,
    audio: btoa(String.fromCharCode(...new Uint8Array(res.audio as ArrayBuffer)))
  })
}