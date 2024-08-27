import { NextRequest, NextResponse } from "next/server";
import { podcastIndexAxiosInstance } from "@/app/utils";

export async function GET(request: NextRequest) {
	const guid = request.nextUrl.searchParams.get("guid");

	if (!guid) {
    return NextResponse.json({ error: "Missing guid parameter" }, { status: 400 });
  };

	try {
		const { data } = await podcastIndexAxiosInstance.get(`/episodes/bypodcastguid?guid=${guid}&pretty`);
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Error fetching podcast episodes:', error);
    
    return NextResponse.json(
      { error: "An error occurred while fetching podcast episodes" },
      { status: 500 }
    );
	};
};
