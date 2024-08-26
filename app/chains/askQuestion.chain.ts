import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { AskQuestionInputType, AskQuestionOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class AskQuestionChain extends Runnable<AskQuestionInputType, AskQuestionOutputType, RunnableConfig> {
	lc_namespace: string[] = ["AskQuestionChain"];

	async invoke(input: AskQuestionInputType): Promise<AskQuestionOutputType> {
		const { question, context } = input;
		console.log('Answering....');
		const { answer } = await hf.questionAnswering({
			model: "deepset/roberta-base-squad2",
			inputs: {
				question,
				context
			},
		},
		{
			wait_for_model: true
		});

		return {
			answer
		}
	}
}