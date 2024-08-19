import axios from "axios";
import { NextResponse } from "next/server";
import crypto from "crypto"
import { poadcastIndexAxiosInstance } from "@/app/utils";

export async function GET(request: Request) {
	const res = await poadcastIndexAxiosInstance.get("/episodes/bypodcastguid?guid=856cd618-7f34-57ea-9b84-3600f1f65e7f&pretty");
	return NextResponse.json({ data: res.data }, { status: 201 });
}

