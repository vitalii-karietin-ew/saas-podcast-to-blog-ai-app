# Podcast to Blog AI App

## Overview

The Podcast to Blog AI App is a full-stack application designed to transcribe, summarize, generate audio, and create visual content based on podcast episodes. The app leverages Hugging Face (HF) APIs, Eleven Labs API, and various other models to process and transform podcast content into engaging blog posts with multimedia elements. This project is built using Next.js and relies on LangChain framework for efficient data handling and API integration.

## Demo

https://github.com/user-attachments/assets/34a4c4c4-f6e4-4630-ae59-44e5b8d727a8

## Preview

[Vercel preview link](https://saas-podcast-to-blog-ai-app.vercel.app/)

## Features

- **Podcast Search and Retrieval**: Search for podcasts using the Podcast Index API.
- **Speech-to-Text Transcription**: Transcribe podcast episodes using the Hugging Face Wav2Vec2 model.
- **Text Summarization**: Summarize transcriptions using the Hugging Face BART model.
- **Text-to-Speech Conversion**: Convert summarized text into speech using Eleven Labs API.
- **Interactive Q&A**: Allow users to interact with the recognized text through a chat interface.
- **Real-Time Translation**: Translate summarized text into French using the Helsinki-NLP model.
- **Image Generation**: Create images based on podcast content using text-to-image models.
- **Multi-Modal Output**: Display the generated title, image, audio, and translated text on the final result page.

## Tech Stack

- **[Next.js](https://nextjs.org/)**: React framework for server-rendered and statically-generated applications.
- **[React](https://reactjs.org/)**: JavaScript library for building user interfaces.
- **[LangChain](https://github.com/hwchase17/langchain)**: Framework for developing applications powered by language models.
- **[Hugging Face Inference](https://huggingface.co/docs/api-inference/index)**: API for model inference, allowing easy integration of Hugging Face models.
- **[Eleven Labs API](https://elevenlabs.io/docs/api-reference/text-to-speech)**: API for advanced text-to-speech capabilities.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for making API requests.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: Library for adding notifications to React applications.

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- Hugging Face account with API key.
- Podcast Index account with API key and API secret.
- Eleven Labs API key for text-to-speech functionality.

### Setup

1. **Clone the repository**:

	```bash
	git clone https://github.com/your-username/podcast-to-blog-ai-app.git
	cd podcast-to-blog-ai-app
	```
2. **Install dependencies**:

	```bash
	npm install
	```

3. **Set up environment variables**:

	Create a .env file in the root directory and add the following:

	```
	NEXT_PUBLIC_BASE_URL=your_base_url
	HF_ACCESS_TOKEN=your_huggingface_api_key
	NEXT_PODCAST_INDEX_API_KEY=your_podcast_index_api_key
	NEXT_PODCAST_INDEX_API_KEY_SECRET=your_podcast_index_api_secret
	ELEVENLABS_API_KEY=your_elevenlabs_api_key
	```

4. **Start the development server**:

	```bash
	npm run dev
	```

## Usage

1. **Search for a Podcast**: Enter the podcast name (e.g., "EdTech Shorts") in the search bar to find a show using the Podcast Index API.

2. **Select a Podcast**: Choose the podcast to proceed with.

3. **Select an Episode**: Choose the episode from the results.

4. **Process the Episode**: Click the "Process episode" button.

3. **Transcription and Summarization**: The app will transcribe the selected episode using the Wav2Vec2 model and summarize the text using the BART model.

4. **Audio Generation**: The summarized text is converted to audio using the Eleven Labs API.

5. **Interactive Q&A**: Users can ask questions related to the podcast episode's content via a chat interface using the Zephyr-7B model.

6. **Translation**: Click on the translation button to convert the summarized text into French.

7. **Image Generation**: An image is generated based on the podcast content using the ZB-Tech or Stability AI model.

## Models and APIs

- **Speech-to-Text**: [Wav2Vec2](https://huggingface.co/facebook/wav2vec2-base-960h?inference_api=true)
- **Text Summarization**: [BART](https://huggingface.co/facebook/bart-large-cnn)
- **Text-to-Speech**: [Eleven Labs API](https://elevenlabs.io/docs/api-reference/text-to-speech)
- **Q&A**: [Zephyr-7B](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)
- **Translation**: [Helsinki-NLP](https://huggingface.co/Helsinki-NLP/opus-mt-en-fr)
- **Image Generation**: [ZB-Tech/Text-to-Image](https://huggingface.co/ZB-Tech/Text-to-Image) or [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
