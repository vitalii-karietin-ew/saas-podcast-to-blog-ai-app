import { HfInference } from "@huggingface/inference";
import { ChainStep, PromptGenerationInputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class PromptGenerationChain extends Runnable<PromptGenerationInputType, string, RunnableConfig> {
	lc_namespace: string[] = ["PromptGenerationChain"];

	async invoke(input: PromptGenerationInputType): Promise<string> {
		const { text, callback } = input;
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
			callback(ChainStep.PromptGeneration, prompt.choices[0].message.content);
			return prompt.choices[0].message.content;
		};

		callback(ChainStep.PromptGeneration, "");
		return "";
	}
}