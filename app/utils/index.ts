import axios, { AxiosInstance } from 'axios';
import crypto from "crypto";
import { PODCAST_INDEX_API_BASE_URL } from '@/app/constants';

const podcastIndexApiKey: string = process.env.NEXT_PODCAST_INDEX_API_KEY as string;
const podcastIndexApiKeySecret: string = process.env.NEXT_PODCAST_INDEX_API_KEY_SECRET as string;
const apiHeaderTime = Math.floor(new Date().getTime()/1000.0);

export const podcastIndexAxiosInstance: AxiosInstance = axios.create({
  baseURL: PODCAST_INDEX_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
		"User-Agent": "SuperPodcastPlayer/1.8",
		"X-Auth-Date": apiHeaderTime,			
		"X-Auth-Key": podcastIndexApiKey,
		"Authorization": crypto.createHash("sha1").update((podcastIndexApiKey + podcastIndexApiKeySecret + apiHeaderTime).toString()).digest('hex'),
  },
});

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};