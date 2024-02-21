import { ThemeToggle } from "@/components/theme-toggle";
import { ModelIcon } from "@/components/icons/model-icon";
import Link from "next/link";
import { Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

const spaceMono = Space_Mono({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export function Nav() {
  return (
    <div
      className="
      py-2 px-2
      md:px-8
      border-b flex items-center"
    >
      <div className="flex flex-1 items-center">
        <Link href="/">
          <h1 className={cn("font-light text-xl", spaceMono.className)}>
            <span className="text-pink-700">sdxl</span>
            <span>⚡️</span>
            <span>lightning</span>
          </h1>
        </Link>
      </div>
      <div className="flex flex-none items-center space-x-4">
        <ThemeToggle />
        <Button size="sm" asChild>
          <Link
            href="https://github.com/fal-ai/sdxl-lightning-demo-app"
            className="flex flex-row space-x-2 items-center"
            target="_blank"
          >
            <GithubIcon className="h-5 w-5" />
            <span>Fork on GitHub</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
