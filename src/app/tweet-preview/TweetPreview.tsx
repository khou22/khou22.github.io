"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { classNames } from "@/utils/style";

type ImageData = { id: number; dataUrl: string };

const LOCAL_STORAGE_KEY = "tweetPreview";

export const TweetPreview = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as { text: string; images: string[] };
        setText(data.text || "");
        setImages(
          data.images.map((d) => ({ id: Date.now() + Math.random(), dataUrl: d }))
        );
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ text, images: images.map((i) => i.dataUrl) })
    );
  }, [text, images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 4 - images.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), dataUrl: reader.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      });
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <Textarea
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          className="mb-1"
        />
        <p className="mb-3 text-right text-xs text-slate-500">
          {text.length}/280
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
                  <Button type="button" size="icon" variant="destructive" onClick={() => removeImage(idx)}>
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded border p-4">
        {images.length > 0 && (
          <div
            className={classNames(
              "mb-2 grid gap-2", 
              images.length === 1 ? "" : "grid-cols-2"
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
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};
