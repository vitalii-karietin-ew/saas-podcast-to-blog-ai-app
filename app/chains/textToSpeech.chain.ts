import { TextToSpeechInputType, TextToSpeechOutputType } from "../utils/types";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { ElevenLabsClient, ElevenLabs } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
const voiceId = "eVItLK1UvXctxuaRV2Oq";

export class TextToSpeechChain extends Runnable<TextToSpeechInputType, TextToSpeechOutputType, RunnableConfig> {
	lc_namespace: string[] = ["TextToSpeechChain"];

	async invoke(input: TextToSpeechInputType): Promise<TextToSpeechOutputType> {
		const { text } = input;
		console.log('Text to speech processing...');
		try {
			const audioOutput = await client.textToSpeech.convert(voiceId, {
				text,
				voice_settings: {
					stability: 0.1,
					similarity_boost: 0.3,
					style: 0.2
				}
			});
			const chunks: Buffer[] = [];
			for await (const chunk of audioOutput) {
				chunks.push(chunk);
			}

			const content = Buffer.concat(chunks);

			return {
				audio: content,
				text
			}
		} catch(e) {
			// TODO: Handle error
			throw new Error(e)
		}
	}
}