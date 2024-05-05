import { ogImageSize } from "@/constants/ogImage";
import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";

type PhotoAlbumCoverProps = {
  name: string;
  photos: [PhotoIdType, PhotoIdType, PhotoIdType];
};

/**
 * Photo album cover image to be used as the OG image for the album.
 */
export const PhotoAlbumCover: React.FC<PhotoAlbumCoverProps> = ({
  name,
  photos,
}) => {
  const [leftPhoto, heroPhoto, rightPhoto] = photos;

  return (
    <div
      style={{
        width: ogImageSize.width,
        height: ogImageSize.height,
        backgroundColor: "teal",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>{name}</p>
      </div>
      <div
        style={{
          width: "100%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <img
          src={getCdnAsset(heroPhoto)}
          alt={getPhotoName(heroPhoto)}
          width={800}
          height={450}
          style={{
            objectFit: "cover",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>
    </div>
  );
};
