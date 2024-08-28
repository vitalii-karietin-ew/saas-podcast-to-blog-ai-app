import { NextRequest, NextResponse } from "next/server";
import { podcastIndexAxiosInstance } from "@/app/utils";

export async function GET(request: NextRequest) {
	const search = request.nextUrl.searchParams.get("search");
	try {
		const res = await podcastIndexAxiosInstance.get(`/search/bytitle?q=${search}&type=all&pretty`);
		return NextResponse.json({ data: res.data }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

