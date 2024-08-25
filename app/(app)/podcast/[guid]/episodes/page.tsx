"use client";

import { ChatWindow } from "@/app/components/ChatWindow/ChatWindow";
import axios from "axios";
import { useEffect, useState } from "react";

type Params = {
	guid: string;
};

type PageProps = {
	params: Params;
};

function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const SummaryBox = ({ title, content }: { title: string, content: string }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold text-gray-200 mb-2">{title}:</h2>
    <div className="bg-gray-700 p-4 rounded-lg text-gray-300">
      {content}
    </div>
  </div>
);

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold mb-2">Audio</h2>
    <audio controls src={audioUrl} className="w-full"></audio>
  </div>
);

const GeneratedImage = ({ imageUrl }: { imageUrl: string }) => (
  <div className="mb-6">
    <div className="flex justify-center">
      <img 
        src={imageUrl} 
        alt="Generated" 
        className="max-w-md w-full h-auto rounded-lg shadow-md" 
      />
    </div>
  </div>
);

export const EpisodesPage = ({ params }: PageProps) => {
	const { guid } = params;
	const [loading, setLoading] = useState(true);
	const [episodes, setEpisodes] = useState<any>([]);
	const [selectedEpisode, setSelectedEpisode] = useState<string | undefined>();
	const [summary, setSummary] = useState<string | undefined>();
	const [audioUrl, setAudioUrl] = useState<string | undefined>();
	const [translatedSummary, setTranslatedSummary] = useState<string | undefined>();
	const [image, setImage] = useState<string | undefined>();
	const [summarizationLoading, setSummarizationLoading] = useState(false);
	const [translationLoading, setTranslationLoading] = useState(false);

  useEffect(() => {
    // Clean up the object URL on component unmount
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, []);

	useEffect(() => {
		setLoading(true);
		const fetchEpisodes = async () => {
			const { data } = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poadcast-episodes?guid=${guid}`);
			setEpisodes(data.data.items);
			setLoading(false);
		}
		fetchEpisodes();
	}, [guid]);

	const onSelectEpisode = (episodeGuid: any) => {
		setSelectedEpisode(episodeGuid);

		// Reset state
		setSummary(undefined);
		setTranslatedSummary(undefined);
		setImage(undefined);
		setAudioUrl(undefined);
	}

	const onTranslateSummarization = async () => {
		setTranslationLoading(true);
		const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/translate`, {
			textToTranslate: summary,
		});
		setTranslatedSummary(data.translaion);
		setTranslationLoading(false);
	};

	const onProcessEpisodeHandler = async () => {
		const audioLink = episodes.find((episode: any) => episode.guid === selectedEpisode)?.enclosureUrl;

		if (audioLink) {
			setSummarizationLoading(true);
			// Speech to text
			const { data: summaryResponse } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/speech-to-text`, {
				audioLink,
			});
			setSummary(summaryResponse.summary);
			console.log(summaryResponse.summary);

			// Audio to text
			const { data: audioResponse } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/text-to-speech`, {
				textToSpeech: summaryResponse.summary,
			},{
				responseType: "arraybuffer"
			});

			// create Blob from ArrayBuffer and use it as audio source
			const audioBlob = new Blob([audioResponse as Buffer], { type: 'audio/mp3' });
			const audioUrl = URL.createObjectURL(audioBlob);
			setAudioUrl(audioUrl);

			// Generate image
			const { data: imageResponse } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/image-generation`, {
				prompt: summaryResponse.summary,
			}, {
				responseType: 'blob',
			});
			const base64String = await blobToBase64(imageResponse);
			setImage(base64String as string);

			setSummarizationLoading(false);
		}
	};

	const formatDuration = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	};

	return (
		<div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Episodes</h1>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 p-4">
          {loading ? (
            <div role="status">
							<svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {episodes.map((episode: any) => (
								<div key={episode.guid} className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${selectedEpisode === episode.guid ? 'bg-gray-800' : 'bg-gray-900'}`}>
									<div className="flex flex-col md:flex-row">
										<img className="w-full h-48 md:w-48 md:h-full object-cover" src={episode.image} alt={episode.title} />
										<div className="flex-1 p-6">
											<h5 className="text-xl font-bold text-white mb-2 line-clamp-2">{episode.title}</h5>
											<p className="text-sm text-gray-300 mb-3">Published: {episode.datePublishedPretty}</p>
											<p className="text-sm text-gray-300 mb-3">Duration: {formatDuration(episode.duration)}</p>
											<p className="text-gray-300 mb-4 line-clamp-3">{episode.description.split(/<[^>]*>/).join('').slice(0, 150).concat("...")}</p>
											<button
												className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
												onClick={() => onSelectEpisode(episode.guid)}
											>
												Select Episode
											</button>
										</div>
									</div>
								</div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 p-4 bg-gray-900 text-white">
          {selectedEpisode ? (
            <div className="space-y-6">
							{!summary && (
								<button
									disabled={loading}
									onClick={onProcessEpisodeHandler}
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
								>
									Process episode
								</button>
							)}

							{summarizationLoading && (
								<div className="flex justify-center items-center">
									<div role="status">
										<svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
										</svg>
										<span className="sr-only">Loading...</span>
									</div>
								</div>
							)}

							{summary && (
								<div className="space-y-4 mt-10">
									{image && (
										<GeneratedImage imageUrl={image} />
									)}
									
									{audioUrl && (
										<AudioPlayer audioUrl={audioUrl} />
									)}
									<SummaryBox title="Summary" content={summary} />

									{translationLoading && (
										<div role="status">
											<svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
												<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
											</svg>
											<span className="sr-only">Loading...</span>
										</div>
									)}

									{translatedSummary && (
										<SummaryBox title="French" content={translatedSummary} />
									)}
									<button
										disabled={loading}
										onClick={onTranslateSummarization}
										className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
									>
										Translate to French
									</button>
								</div>
							)}

							{summary && (
								<ChatWindow
									endpoint="/api/ask-question"
									emptyStateComponent={<div>No messages</div>}
									body={{ audioLink: episodes.find((episode: any) => episode.guid === selectedEpisode)?.enclosureUrl }}
								/>
							)}
            </div>
          ) : (
            <div>Select episode</div>
          )}
        </div>
      </div>
    </div>
	);
};

export default EpisodesPage;