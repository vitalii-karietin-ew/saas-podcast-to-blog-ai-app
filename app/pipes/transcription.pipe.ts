import { HfInference } from "@huggingface/inference";
import { PodcastProcessingInput, StepCallback } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export default () => ({
	name: 'transcription',
	run: async (input: PodcastProcessingInput, callback: StepCallback) => {
		console.log('Transcribing audio...');
		const transcription = await hf.automaticSpeechRecognition({
				model: 'facebook/wav2vec2-base-960h',
				data: input.audioFile
		});

		callback('transcription', transcription.text);
		return transcription.text;
	}
})