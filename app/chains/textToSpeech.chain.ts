import { HfInference } from "@huggingface/inference";
import { ChainStep, TextToSpeechInputType, TextToSpeechOutputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class TextToSpeechChain extends Runnable<TextToSpeechInputType, TextToSpeechOutputType, RunnableConfig> {
	lc_namespace: string[] = ["TextToSpeechChain"];

	async invoke(input: TextToSpeechInputType): Promise<TextToSpeechOutputType> {
		const { text, callback } = input;
		console.log('Text to speech processing...');
		const audioOutput = await hf.textToSpeech({
			model: 'elevenlabs/api-reference/text-to-speech',
			inputs: text
		},{
			wait_for_model: true
		});

		// TODO: Implement callback
		// callback(ChainStep.TextToSpeech, audioOutput);
		return {
			audio: audioOutput,
			text
		}
	}
}