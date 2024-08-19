import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import axios from "axios";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const { audioLink } = body;

  // Download the file
  // const response = await axios.get(audioLink, { responseType: 'arraybuffer' });
  // const tempFilePath = join(__dirname, 'audio.mp3');
  // writeFileSync(tempFilePath, Buffer.from(response.data));
	// console.log(tempFilePath)

	let response = await axios.get(audioLink)
	console.log("response.data", typeof response.data)
	let audioBlob = await response.data.blob();
	// console.log("blob", audioBlob)
  try {
	// Load the model and process the file
	const res = await hf.automaticSpeechRecognition({
	  model: 'facebook/wav2vec2-base-960h',
	  data: audioBlob,
	},
	{
	  wait_for_model: true
	});

	// Return the result
	return NextResponse.json(res);
  } catch (error) {
	console.error("Error processing the audio file:", error);
	return NextResponse.json({ error: "Error processing the audio file" });
  } finally {
	// Remove the temporary file
	// unlinkSync(tempFilePath);
  }
}