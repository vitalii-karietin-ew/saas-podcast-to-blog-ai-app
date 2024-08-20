import { HfInference } from "@huggingface/inference";
import { ImageGenerationInputType, ChainStep, ImageGenerationOutputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export class ImageGenerationChain extends Runnable<ImageGenerationInputType, ImageGenerationOutputType, RunnableConfig> {
	lc_namespace: string[] = ["ImageGenerationChain"];

	async invoke(input: ImageGenerationInputType): Promise<ImageGenerationOutputType> {
		const { prompt, callback } = input;
		console.log('Generating image....');
		const image = await hf.textToImage({
			model: "ZB-Tech/Text-to-Image",
			inputs: prompt,
		},
		{
			wait_for_model: true
		});

		// TODO: Implement callback
		// callback(ChainStep.ImageGeneration, image);
		return {
			image
		}
	}
}