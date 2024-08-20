"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {

  useEffect(() => {
    async function fetchData() {
      try {
        // const episodesResponse = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poadcast-episodes`);

        // const latestEpisodeByDatePublished = (episodesResponse.data.data.items || []).sort((a: any, b: any) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime())[0];
        // const latestEpisodeAudioLink = latestEpisodeByDatePublished.enclosureUrl;
        const speechToTextResponse = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/api/process-episode`, {
          method: "POST",
        });
        console.log(speechToTextResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>Home</div>
  );
}