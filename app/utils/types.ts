export type StepCallback = (step: string, result: string | ArrayBuffer | Blob) => void;
export interface PodcastProcessingInput {
	audioFile: ArrayBuffer;
}