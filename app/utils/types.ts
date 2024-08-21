// Backend
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

export interface TextTranscriptionInputType extends ChainInput {
	audioSource?: Blob | ArrayBuffer;
};

export interface TextTranscriptionOutputType {
	text?: string;
};

export interface SummarizationInputType extends ChainInput {
	text: string;
};

export interface SummarizationOutputType {
	text: string;
};

export interface TextToSpeechInputType extends ChainInput {
	text: string;
};

export interface TextToSpeechOutputType {
	audio: ArrayBuffer | Blob;
	text: string;
};

export interface TextTranslationInputType extends ChainInput {
	text: string;
};

export interface TextTranslationOutputType {
	text: string;
};

export interface PromptGenerationInputType extends ChainInput {
	text: string;
};

export interface PromptGenerationOutputType {
	prompt: string;
};

export interface ImageGenerationInputType extends ChainInput {
	prompt: string;
};

export interface ImageGenerationOutputType {
	image: ArrayBuffer | Blob;
};

// Frontend
export type Podcast = {
	title: string;
	description: string;
	image: string;
	audio: string;
};