"use client";

import { useState, ChangeEvent, useEffect } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { classNames } from "@/utils/style";

type ImageData = { id: number; dataUrl: string };

const LOCAL_STORAGE_KEY = "tweetPreview";

export const TweetPreview = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [showFullText, setShowFullText] = useState(false);

  const MAX_CHARS = 280;
  const truncatedText = text.slice(0, MAX_CHARS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as { text: string; images: string[] };
        setText(data.text || "");
        setImages(
          data.images.map((d) => ({
            id: Date.now() + Math.random(),
            dataUrl: d,
          })),
        );
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ text, images: images.map((i) => i.dataUrl) }),
    );
  }, [text, images]);

  const resizeImage = (dataUrl: string, maxSize: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = dataUrl;
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 4 - images.length;

    for (const file of Array.from(files).slice(0, remaining)) {
      const reader = new FileReader();
      reader.onload = async () => {
        const resizedDataUrl = await resizeImage(reader.result as string, 1400);
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            dataUrl: resizedDataUrl,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const clearAll = () => {
    setText("");
    setImages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages((prev) => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <Textarea
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-1"
        />
        <p
          className={`mb-3 text-right text-xs ${
            text.length > MAX_CHARS ? "text-red-500" : "text-slate-500"
          }`}
        >
          {text.length}/{MAX_CHARS}
        </p>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={images.length >= 4}
        />
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
        {images.length > 0 && (
          <div className="mt-4 space-y-2">
            {images.map((img, idx) => (
              <div key={img.id} className="flex items-center space-x-2">
                <img
                  src={img.dataUrl}
                  alt={`uploaded image ${idx + 1}`}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                  >
                    <ArrowLeftIcon />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1}
                  >
                    <ArrowRightIcon />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeImage(idx)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded border p-4">
        <div className="mb-2">
          <p className="whitespace-pre-wrap">
            {showFullText ? text : truncatedText}
            {text.length > MAX_CHARS && !showFullText && "..."}
          </p>
          {text.length > MAX_CHARS && (
            <Button
              type="button"
              variant="link"
              className="mt-1 h-auto p-0 text-xs"
              onClick={() => setShowFullText(!showFullText)}
            >
              {showFullText ? "Show less" : "See more"}
            </Button>
          )}
        </div>
        {images.length > 0 && (
          <div
            className={classNames(
              "mb-2 grid gap-2",
              images.length === 1 ? "" : "grid-cols-2",
            )}
          >
            {images.map((img, idx) => (
              <img
                key={img.id}
                src={img.dataUrl}
                alt={`tweet image ${idx + 1}`}
                className="aspect-square w-full rounded object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
