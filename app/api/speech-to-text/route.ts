import path from 'path';
import axios from "axios";
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
const fs = require('fs').promises;

const filePath = path.resolve('D:/Projects/saas-podcast-to-blog-ai-app/small.mp3');

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);
const chunkSize = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
	const body = await request.json();
	const { audioLink } = body;
	if (audioLink) {
		let response = await axios.get(audioLink, {
			responseType: 'arraybuffer'
		});

		let audioFile = response.data;

		if (!(audioFile instanceof ArrayBuffer)) {
			audioFile = new Uint8Array(audioFile).buffer;
		}

		// Convert ArrayBuffer to Blob
		const audioBlob = new Blob([audioFile], { type: 'audio/wav' });

		const res = await hf.automaticSpeechRecognition({
				model: 'facebook/wav2vec2-base-960h',
				data: audioBlob,
		}, {
				wait_for_model: true
		});
	
		return NextResponse.json(res);
	} else {
		try {
			const chunks: any = [];
			const audioBuffer = await fs.readFile(filePath);
			// Split the audio file into chunks
			for (let i = 0; i < audioBuffer.length; i += chunkSize) {
				const chunk = audioBuffer.slice(i, i + chunkSize);
				chunks.push(chunk);
			}
			
			const outputBuffers = [];
			let chunkIndex = 0;
			for (const chunk of chunks) {
				const chunkArrayBuffer = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
	
				const chunkBlob = new Blob([chunkArrayBuffer], { type: 'audio/flac' });
				console.log(`Chunk ${chunkIndex}: recognition started`)
	
				const res = await hf.automaticSpeechRecognition({
					model: 'facebook/wav2vec2-base-960h',
					data: chunkBlob,
				}, {
					wait_for_model: true
				});
	
				const outputBuffer = res;
				outputBuffers.push(outputBuffer);
				chunkIndex++;
			};

			return NextResponse.json(outputBuffers, { status: 200 });
		} catch (error) {
			console.error("Error processing the audio file:", error);
			return NextResponse.json({ error: "Error processing the audio file" }, { status: 400 });
		}
	}
}