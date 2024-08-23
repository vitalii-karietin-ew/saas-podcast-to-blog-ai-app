"use client";

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
}

export const EpisodesPage = ({ params }: PageProps) => {
	const { guid } = params;
	const [loading, setLoading] = useState(true);
	const [episodes, setEpisodes] = useState<any>([]);
	const [selectedEpisode, setSelectedEpisode] = useState<string | undefined>();
	const [summary, setSummary] = useState<string | undefined>();
	const [audioUrl, setAudioUrl] = useState<string | undefined>();
	const [translatedSummary, setTranslatedSummary] = useState<string | undefined>();
	const [question, setQuestion] = useState<string | undefined>();
	const [answer, setAnswer] = useState<string | undefined>();
	const [image, setImage] = useState<string | undefined>();
	const [summarizationLoading, setSummarizationLoading] = useState(false);
	const [translationLoading, setTranslationLoading] = useState(false);
	const [questionLoading, setQuestionLoading] = useState(false);

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

	const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
		setQuestionLoading(true);
	
		const audioLink = episodes.find((episode: any) => episode.guid === selectedEpisode)?.enclosureUrl;

		const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ask-question`, {
			question,
			audioLink
		});

		setAnswer(data);
		setQuestionLoading(false);
  };


	return (
		<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Episodes</h1>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 p-4">
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
                <div key={episode.guid} className="bg-white rounded-lg shadow-md flex">
                  <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={episode.image} alt="" />
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{episode.title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{episode.description}</p>
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setSelectedEpisode(episode.guid)}
                    >
                      Select Episode
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 p-4">
          {selectedEpisode ? (
            <div className="pb-8 divide-y">
              <button
                disabled={loading}
                onClick={onProcessEpisodeHandler}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Process episode
              </button>
            </div>
          ) : (
            <div>Select episode</div>
          )}
					{summarizationLoading && (
						<div role="status">
							<svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					)}
          {summary && (
            <div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
								<div className="text-lg font-semibold text-gray-800 mb-2">
									Summary:
								</div>
								<div className="bg-white p-4 rounded-lg shadow-inner text-gray-700">
									{summary}
								</div>
							</div>
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
								<div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
									<div className="text-lg font-semibold text-gray-800 mb-2">
										French:
									</div>
									<div className="bg-white p-4 rounded-lg shadow-inner text-gray-700">
										{translatedSummary}
									</div>
								</div>
              )}
              <button
                disabled={loading}
                onClick={onTranslateSummarization}
                className="mt-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Translate to french
              </button>
							<form onSubmit={handleQuestionSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
								<div className="mb-4">
									<label className="block text-gray-700 font-bold mb-2" htmlFor="question">
										Ask a Question
									</label>
									<input
										type="text"
										id="question"
										value={question}
										onChange={(e) => setQuestion(e.target.value)}
										className="text-black w-full px-3 py-2 border rounded-lg"
										required
									/>
								</div>
								<button
									type="submit"
									className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
								>
									Submit
								</button>
							</form>
							{questionLoading && (
								<div role="status">
									<svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
										<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
									</svg>
									<span className="sr-only">Loading...</span>
								</div>
							)}
							{answer && (
								<div className="mt-4 bg-white p-4 rounded-lg shadow-md text-black">
									<h3 className="text-xl font-semibold">Answer</h3>
									<p className="text-gray-600">{answer}</p>
								</div>
							)}

							{audioUrl && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">Audio</h2>
                  <audio controls src={audioUrl} className="w-full mb-4"></audio>
                </div>
              )}
              {image && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">Generated Image</h2>
                  <img src={image} alt="Generated" className="w-full mb-4" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
	);
};

export default EpisodesPage;