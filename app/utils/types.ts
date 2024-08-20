
export enum ChainStep {
  Transcription,
	Summarization,
	PromptGeneration,
	TextToSpeech,
  ImageGeneration,
	Translation,
};

export type StepCallback = (step: ChainStep, result: string | ArrayBuffer | Blob | null) => void;

export interface PodcastProcessingInput {
	audioFile: ArrayBuffer;
};

interface ChainInput {
	callback?: StepCallback;
};

export interface SummarizationInputType extends ChainInput {
	textToSummarize: string;
};

export interface ImageGenerationInputType extends ChainInput {
	prompt: string;
};

export interface PromptGenerationInputType extends ChainInput {
	text: string;
};

export interface TextToSpeechInputType extends ChainInput {
	text: string;
};

export interface TextTranslationInputType extends ChainInput {
	text: string;
};

export interface TextTranscriptionInputType extends ChainInput {
	audioSource?: Blob;
};
