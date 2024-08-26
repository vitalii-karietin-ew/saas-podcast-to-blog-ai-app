import { HfInference } from "@huggingface/inference";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { ImageGenerationInputType, ImageGenerationOutputType } from "../utils/types";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class ImageGenerationChain extends Runnable<ImageGenerationInputType, ImageGenerationOutputType, RunnableConfig> {
	lc_namespace: string[] = ["ImageGenerationChain"];

	async invoke(input: ImageGenerationInputType): Promise<ImageGenerationOutputType> {
		const { prompt } = input;
		console.log('Generating image....');
		const image = await hf.textToImage({
			model: "ZB-Tech/Text-to-Image",
			inputs: prompt,
		},
		{
			wait_for_model: true
		});

		return {
			image
		}
	}
}