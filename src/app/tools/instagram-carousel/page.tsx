import { Metadata } from "next";
import { InstagramCarouselCreator } from "./InstagramCarouselCreator";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Instagram Carousel Creator | Kevin Hou",
  description:
    "Create Instagram carousel posts with consistent aspect ratios, custom backgrounds, borders, text overlays, and drag-to-reorder slides.",
};

const InstagramCarouselPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-2 text-center leading-loose">
        Instagram Carousel Creator
      </h1>
      <p className="mb-8 text-center text-gray-500">
        Upload images, arrange slides, customize backgrounds and borders, add
        text, then export high-resolution PNGs for Instagram.
      </p>
      <InstagramCarouselCreator />
    </PageWrapper>
  );
};

export default InstagramCarouselPage;
