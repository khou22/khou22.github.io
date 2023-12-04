import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import Image from "next/image";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";

export const AlbumsSection = () => {
  let rotations = [
    "rotate-2 hover:rotate-3",
    "-rotate-2 hover:rotate-1",
    "rotate-2 hover:-rotate-2",
    "rotate-2 hover:-rotate-1",
    "-rotate-2 hover:rotate-2",
  ];

  const albums = [
    {
      name: "Landscape",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
    {
      name: "Engagements",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
    {
      name: "Events",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
    {
      name: "Concert",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
    {
      name: "Headshots",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
    {
      name: "Drone",
      image: getCdnAsset("media/store/Grand_Teton_Bison_jpg"),
      url: PAGES.PHOTOGRAPHY,
    },
  ];

  return (
    <div className="grid w-full grid-cols-3 gap-6 py-4 md:gap-16 lg:grid-cols-6">
      {albums.map(({ name, image }, imageIndex) => (
        <FadeInView key={name} delayMS={imageIndex * 50} durationMS={1000}>
          <div
            className={classNames(
              "relative aspect-[4/5] w-full flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:rounded-2xl",
              "transition-transform duration-300 ease-in-out",
              rotations[imageIndex % rotations.length],
            )}
          >
            <Image
              src={image}
              alt={name}
              fill
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </FadeInView>
      ))}
    </div>
  );
};
