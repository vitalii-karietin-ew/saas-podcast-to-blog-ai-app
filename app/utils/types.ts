export interface PodcastProcessingInput {
	audioFile: ArrayBuffer;
};


export interface TextTranscriptionInputType {
	audioSource?: Blob | ArrayBuffer;
};

export interface TextTranscriptionOutputType {
	text?: string;
};

export interface SummarizationInputType {
	text: string;
};

export interface SummarizationOutputType {
	text: string;
};

export interface TextToSpeechInputType {
	text: string;
};

export interface TextToSpeechOutputType {
	audio: Buffer;
	text: string;
};

export interface TextTranslationInputType {
	text: string;
};

export interface TextTranslationOutputType {
	text: string;
};

export interface PromptGenerationInputType {
	text: string;
};

export interface PromptGenerationOutputType {
	prompt: string;
};

export interface ImageGenerationInputType {
	prompt: string;
};

export interface ImageGenerationOutputType {
	image: Blob;
};

export interface AskQuestionInputType {
	question: string;
	context: string;
};

export interface AskQuestionOutputType {
	answer: string;
};

// Frontend
export type Podcast = {
	podcastGuid: string;
	title: string;
	description: string;
	image: string;
	audio: string;
};