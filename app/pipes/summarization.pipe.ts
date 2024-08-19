import { HfInference } from "@huggingface/inference";
import { StepCallback } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export default () => ({
	name: 'summarization',
	run: async (transcription: string, callback: StepCallback): Promise<string> => {
		console.log('Summarizing transcription...');
		const summary = await hf.summarization({
				model: 'facebook/bart-large-cnn',
				inputs: transcription
		});

		// Streaming result for summarization
		callback('summarization', summary.summary_text);
		return summary.summary_text;
	}
})