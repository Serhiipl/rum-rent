"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export type GalleryImage = {
  id?: string | number;
  url: string;
  alt?: string;
};

interface GalleryProps {
  images: GalleryImage[] | undefined | null;
  initialIndex?: number;
  className?: string;
  aspectClass?: string; // e.g. "aspect-video" | "aspect-square"
  showThumbnails?: boolean;
  enableLightbox?: boolean;
}

// Optional lightbox or thumbnails:
// <Gallery images={images} showThumbnails={false} />
// <Gallery images={images} enableLightbox={false} />
// Custom aspect ratio:
// <Gallery images={images} aspectClass="aspect-square" />

const Gallery: React.FC<GalleryProps> = ({
  images,
  initialIndex = 0,
  className,
  aspectClass = "aspect-video",
  showThumbnails = true,
  enableLightbox = true,
}) => {
  const imgs = (images ?? []).filter(Boolean);
  const [index, setIndex] = React.useState(
    Math.min(Math.max(initialIndex, 0), Math.max((imgs.length || 1) - 1, 0))
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setIndex(
      Math.min(Math.max(initialIndex, 0), Math.max((imgs.length || 1) - 1, 0))
    );
  }, [initialIndex, imgs.length]);

  if (!imgs.length) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-muted/30 p-6 text-center",
          className
        )}
      >
        Brak obrazów
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i - 1 + imgs.length) % imgs.length);
  const goNext = () => setIndex((i) => (i + 1) % imgs.length);

  const current = imgs[index];

  return (
    <div className={cn("w-full", className)}>
      {/* Main preview */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md",
          aspectClass
        )}
      >
        <Image
          src={current.url}
          alt={current.alt || `Image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={index === 0}
        />

        {/* Controls */}
        {imgs.length > 1 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full bg-background/70 hover:bg-background/90"
              onClick={goPrev}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full bg-background/70 hover:bg-background/90"
              onClick={goNext}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {enableLightbox && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 rounded-full bg-background/70 hover:bg-background/90"
            onClick={() => setOpen(true)}
            aria-label="Open lightbox"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && imgs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border",
                i === index ? "ring-2 ring-primary" : "border-muted"
              )}
              aria-label={`Select image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Thumbnail ${i + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {enableLightbox && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl h-full  md:h-3/4 md:my-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Podgląd</span>
                {/* <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button> */}
              </DialogTitle>
            </DialogHeader>
            <div className="relative w-full overflow-hidden rounded">
              <div className={cn("relative mx-auto w-full", aspectClass)}>
                <Image
                  src={current.url}
                  alt={current.alt || `Image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain bg-black/5"
                />
              </div>
            </div>
            {imgs.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-3">
                <Button type="button" variant="secondary" onClick={goPrev}>
                  Poprzedni
                </Button>
                <span className="text-sm text-muted-foreground">
                  {index + 1} / {imgs.length}
                </span>
                <Button type="button" variant="secondary" onClick={goNext}>
                  Następny
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;
