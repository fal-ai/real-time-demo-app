"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import * as fal from "@fal-ai/serverless-client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ModelIcon } from "@/components/icons/model-icon";
import Link from "next/link";

const DEFAULT_PROMPT =
  "A cinematic shot of a baby raccoon wearing an intricate italian priest robe";

function randomSeed() {
  return Math.floor(Math.random() * 10000000).toFixed(0);
}

fal.config({
  proxyUrl: "/api/proxy",
});

const INPUT_DEFAULTS = {
  _force_msgpack: new Uint8Array([]),
  enable_safety_checker: true,
  image_size: "square_hd",
  sync_mode: true,
  num_images: 1,
  num_inference_steps: "2",
};

export default function Lightning() {
  const [image, setImage] = useState<null | string>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [seed, setSeed] = useState<string>(randomSeed());
  const [inferenceTime, setInferenceTime] = useState<number>(NaN);

  const connection = fal.realtime.connect("fal-ai/fast-lightning-sdxl", {
    connectionKey: "lightning-sdxl",
    throttleInterval: 64,
    onResult: (result) => {
      const blob = new Blob([result.images[0].content], { type: "image/jpeg" });
      setImage(URL.createObjectURL(blob));
      setInferenceTime(result.timings.inference);
    },
  });

  const timer = useRef<any | undefined>(undefined);

  const handleOnChange = async (prompt: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPrompt(prompt);
    const input = {
      ...INPUT_DEFAULTS,
      prompt: prompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    };
    connection.send(input);
    timer.current = setTimeout(() => {
      connection.send({ ...input, num_inference_steps: "4" });
    }, 500);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
    // initial image
    connection.send({
      ...INPUT_DEFAULTS,
      num_inference_steps: "4",
      prompt: prompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    });
  }, []);

  return (
    <main>
      <div className="container py-4 px-1.5 space-y-4 lg:space-y-8 mx-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
            <div className="flex-1 space-y-1">
              <label>Prompt</label>
              <Input
                onChange={(e) => {
                  handleOnChange(e.target.value);
                }}
                className="font-light w-full"
                placeholder="Type something..."
                value={prompt}
              />
            </div>
            <div className="space-y-1">
              <label>Seed</label>
              <Input
                onChange={(e) => {
                  setSeed(e.target.value);
                  handleOnChange(prompt);
                }}
                className="font-light w-full"
                placeholder="random"
                type="number"
                value={seed}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0">
          <div className="flex-1 flex-col flex items-center justify-center">
            {image && inferenceTime && (
              <div className="flex flex-row space-x-1">
                <span>inference time</span>
                <strong>
                  {inferenceTime
                    ? `${(inferenceTime * 1000).toFixed(0)}ms`
                    : `n/a`}
                </strong>
              </div>
            )}
            <div className="min-h-[512px] max-w-fit">
              {image && (
                <img id="imageDisplay" src={image} alt="Dynamic Image" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center my-4">
        <p className="text-sm text-base-content/70 py-4 text-center">
          This playground is hosted on{" "}
          <strong>
            <a href="https://fal.ai" className="underline" target="_blank">
              fal.ai
            </a>
          </strong>{" "}
          and is for demonstration purposes only.
        </p>
        <div className="flex flex-row items-center space-x-2">
          <span className="text-xs font-mono">powered by</span>
          <Link href="https://fal.ai" target="_blank">
            <ModelIcon />
          </Link>
        </div>
      </div>
    </main>
  );
}
