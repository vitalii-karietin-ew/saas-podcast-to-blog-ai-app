
import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { SummarizationInputType, SummarizationOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class SummarizationChain extends Runnable<SummarizationInputType, SummarizationOutputType, RunnableConfig> {
	lc_namespace: string[] = ["SummarizationChain"];

	async invoke(input: SummarizationInputType): Promise<SummarizationOutputType> {
		const { text } = input;
		console.log('Summarizing transcription...');
		const summary = await hf.summarization({
			model: 'facebook/bart-large-cnn',
			inputs: text
		});

		return {
			text: summary.summary_text
		}
	}
}