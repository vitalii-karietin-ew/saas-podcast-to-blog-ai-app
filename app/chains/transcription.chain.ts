import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { TextTranscriptionInputType, TextTranscriptionOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class TextTranscriptionChain extends Runnable<TextTranscriptionInputType, TextTranscriptionOutputType, RunnableConfig> {
	lc_namespace: string[] = ["TextTranscriptionChain"];

	async invoke(input: TextTranscriptionInputType): Promise<TextTranscriptionOutputType> {
		const { audioSource } = input;
		console.log('Transcribing audio...');

		const blob = new Blob([audioSource as ArrayBuffer], { type: 'audio/flac' });

		const res = await hf.automaticSpeechRecognition({
			model: 'facebook/wav2vec2-base-960h',
			data: blob,
		}, {
			wait_for_model: true
		});

		return {
			text:	res.text
		}
	}
};