import path from 'path';
const fs = require('fs').promises;
import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { ChainStep, TextTranscriptionInputType, TextTranscriptionOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

const filePath = path.resolve(__dirname, "../../../../../small.mp3");

export class TextTranscriptionChain extends Runnable<TextTranscriptionInputType, TextTranscriptionOutputType, RunnableConfig> {
	lc_namespace: string[] = ["TextTranscriptionChain"];

	async invoke(input: TextTranscriptionInputType): Promise<TextTranscriptionOutputType> {
		const { audioSource } = input;
		console.log('Transcribing audio...');
		const audioBuffer = await fs.readFile(filePath);

		const blob = new Blob([audioBuffer], { type: 'audio/flac' });

		const res = await hf.automaticSpeechRecognition({
			model: 'facebook/wav2vec2-base-960h',
			data: blob,
		}, {
			wait_for_model: true
		});

		// TODO: Implement callback
		// callback(ChainStep.Transcription, res.text);
		return {
			text:	res.text
		}
	}
};