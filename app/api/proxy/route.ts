import { route } from "@fal-ai/serverless-proxy/nextjs";
import { type NextRequest } from "next/server";

const URL_ALLOW_LIST = ["https://rest.alpha.fal.ai/tokens/"];

export const POST = (req: NextRequest) => {
  const url = req.headers.get("x-fal-target-url");
  if (!url) {
    return new Response("Not found", { status: 404 });
  }

  if (!URL_ALLOW_LIST.includes(url)) {
    return new Response("Not allowed", { status: 403 });
  }

  const appCheckCookie = req.cookies.get("fal-app");
  if (!appCheckCookie || !appCheckCookie.value) {
    return new Response("Not allowed", { status: 403 });
  }

  return route.POST(req);
};

export const GET = (req: NextRequest) => {
  return route.GET(req);
};
