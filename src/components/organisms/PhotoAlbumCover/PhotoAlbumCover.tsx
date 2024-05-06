import { DiamondPhotoMask } from "./DiamondPhotoMask";
import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { ogImageSize } from "@/constants/ogImage";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

type PhotoAlbumCoverProps = {
  name: string;
  heroPhoto: PhotoIdType;
  photos: [PhotoIdType, PhotoIdType, PhotoIdType];
};

/**
 * Photo album cover image to be used as the OG image for the album.
 */
export const PhotoAlbumCover: React.FC<PhotoAlbumCoverProps> = ({
  name,
  heroPhoto,
  photos,
}) => {
  const largeDiamondsSize = 590;
  const smallDiamondsSize = 230;
  const smallDiamondsLeft = 490;
  const smallDiamondsCenterOffset = 76;

  return (
    <div
      style={{
        width: ogImageSize.width,
        height: ogImageSize.height,
        position: "relative",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <PersonalLogo
        style={{
          position: "absolute",
          left: 35,
          top: 35,
          width: 100,
          height: 100,
        }}
      />

      {/* Background border */}
      <div
        style={{
          position: "absolute",
          left: 193,
          top: 75,
          height: 500,
          width: 814,
          border: "3px solid #DFDFDF",
          display: "flex",
        }}
      />

      <div
        id="cover-content"
        style={{
          position: "absolute",
          left: 35,
          top: 160,
          width: 490,
          height: 280,
          paddingTop: 20,
          paddingBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <h1 style={{ fontSize: 64, marginBottom: 24, fontWeight: "bold" }}>
          {name}
        </h1>
        <h3 style={{ fontSize: 36, marginBottom: 12 }}>
          Kevin Hou Photography
        </h3>
        <p style={{ fontSize: 20 }}>Prints available for purchase.</p>
      </div>

      {/* Main photo */}
      <DiamondPhotoMask
        photoID={heroPhoto}
        left={560}
        top={ogImageSize.height / 2 - largeDiamondsSize / 2}
        width={largeDiamondsSize}
        height={largeDiamondsSize}
        borderColor="white"
        borderWidth={20}
      />

      {/* Left, top photo */}
      <DiamondPhotoMask
        photoID={photos[0]}
        left={smallDiamondsLeft}
        top={
          ogImageSize.height / 2 - smallDiamondsSize - smallDiamondsCenterOffset
        }
        width={smallDiamondsSize}
        height={smallDiamondsSize}
        borderColor="white"
        borderWidth={12}
      />

      {/* Left, bottom photo */}
      <DiamondPhotoMask
        photoID={photos[1]}
        left={smallDiamondsLeft}
        top={ogImageSize.height / 2 + smallDiamondsCenterOffset}
        width={smallDiamondsSize}
        height={smallDiamondsSize}
        borderColor="white"
        borderWidth={12}
      />

      {/* Right, bottom photo */}
      <DiamondPhotoMask
        photoID={photos[2]}
        left={1020}
        top={350}
        width={smallDiamondsSize}
        height={smallDiamondsSize}
        borderColor="white"
        borderWidth={12}
      />
    </div>
  );
};
