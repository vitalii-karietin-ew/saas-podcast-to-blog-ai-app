import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from "crypto";
import { PODCAST_INDEX_API_BASE_URL } from '@/app/constants';

const poadcastIndexApiKey: string = process.env.NEXT_POADCAST_INDEX_API_KEY as string;
const poadcastIndexApiKeySecret: string = process.env.NEXT_POADCAST_INDEX_API_KEY_SECRET as string;
const apiHeaderTime = Math.floor(new Date().getTime()/1000.0);

export const poadcastIndexAxiosInstance: AxiosInstance = axios.create({
  baseURL: PODCAST_INDEX_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
		"User-Agent": "SuperPodcastPlayer/1.8",
		"X-Auth-Date": apiHeaderTime,			
		"X-Auth-Key": poadcastIndexApiKey,
		"Authorization": crypto.createHash("sha1").update(poadcastIndexApiKey + poadcastIndexApiKeySecret + apiHeaderTime).digest('hex'),
  },
});