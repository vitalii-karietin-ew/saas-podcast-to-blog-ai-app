import { HfInference } from "@huggingface/inference";
import { ChainStep, TextToSpeechInputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class TextToSpeechChain extends Runnable<TextToSpeechInputType, ArrayBuffer | Blob, RunnableConfig> {
	lc_namespace: string[] = ["TextToSpeechChain"];

	async invoke(input: TextToSpeechInputType): Promise<ArrayBuffer | Blob> {
		const { text, callback } = input;
		console.log('Text to speech processing...');
		const audioOutput = await hf.textToSpeech({
			model: 'elevenlabs/api-reference/text-to-speech',
			inputs: text
		},{
			wait_for_model: true
		});

		callback(ChainStep.TextToSpeech, audioOutput);
		return audioOutput;
	}
}