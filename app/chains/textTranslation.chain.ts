import { HfInference } from "@huggingface/inference";
import { ChainStep, TextTranslationInputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class TextTranslationChain extends Runnable<TextTranslationInputType, string, RunnableConfig> {
	lc_namespace: string[] = ["TextTranslationChain"];

	async invoke(input: TextTranslationInputType): Promise<string> {
		const { text, callback } = input;
		console.log('Translation...');
		const translationResponse = await hf.translation({
			model: "Helsinki-NLP/opus-mt-en-fr",
			inputs: text,
		},
		{
			wait_for_model: true
		});

		const translation = Array.isArray(translationResponse) ? translationResponse[0].translation_text : translationResponse.translation_text;

		callback(ChainStep.Translation, translation);
		return translation;
	}
};