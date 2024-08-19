import { HfInference } from "@huggingface/inference";
import { StepCallback } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export default () => ({
	name: 'textToSpeech',
	run: async (summary: string, callback: StepCallback): Promise<ArrayBuffer | Blob> => {
		console.log('Converting summary to speech...');
		const audioOutput = await hf.textToSpeech({
				model: 'elevenlabs/api-reference/text-to-speech',
				inputs: summary
		});

		// Streaming result for text-to-speech
		callback('textToSpeech', audioOutput);
		return audioOutput;
	}
})