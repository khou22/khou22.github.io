import { ProgressiveImage } from "@/components/atoms/ProgressiveImage/ProgressiveImage";
import { getAllPhotographyPhotoIDs, getPhotoName } from "@/utils/cdn/cdnAssets";
import { getPhotoProgressiveImages } from "@/utils/photos/getPhotoProgressiveImages";

const BrowserHomePage = async () => {
  const allImages = getAllPhotographyPhotoIDs();
  const photoID = allImages[Math.floor(Math.random() * allImages.length)];

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <ProgressiveImage
        alt={getPhotoName(photoID)}
        src={getPhotoProgressiveImages(photoID)}
        className="absolute -z-10 h-screen w-screen object-cover"
      />
    </div>
  );
};

export default BrowserHomePage;
