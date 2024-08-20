
import { HfInference } from "@huggingface/inference";
import { ChainStep, SummarizationInputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class SummarizationChain extends Runnable<SummarizationInputType, string, RunnableConfig> {
	lc_namespace: string[] = ["SummarizationChain"];

	async invoke(input: SummarizationInputType): Promise<string> {
		const { textToSummarize, callback } = input;
		console.log('Summarizing transcription...');
		const summary = await hf.summarization({
			model: 'facebook/bart-large-cnn',
			inputs: textToSummarize
		});

		callback(ChainStep.Summarization, summary.summary_text);
		return summary.summary_text;
	}
}