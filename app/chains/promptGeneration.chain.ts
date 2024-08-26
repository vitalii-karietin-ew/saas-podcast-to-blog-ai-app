import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { PromptGenerationInputType, PromptGenerationOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class PromptGenerationChain extends Runnable<PromptGenerationInputType, PromptGenerationOutputType, RunnableConfig> {
	lc_namespace: string[] = ["PromptGenerationChain"];

	async invoke(input: PromptGenerationInputType): Promise<PromptGenerationOutputType> {
		const { text } = input;
		console.log('Generating prompt....');

		const prompt = await hf.chatCompletion({
			model: "HuggingFaceH4/zephyr-7b-beta",	
			messages: [{ role: "user", content: `Generate a prompt for the blog post image related to this text: ${text}` }],
			max_tokens: 500,
		},
		{
			wait_for_model: true
		});

		if (prompt?.choices[0]?.message?.content) {
			return {
				prompt: prompt.choices[0].message.content
			}
		};

		return {
			prompt: ""
		}
	}
}