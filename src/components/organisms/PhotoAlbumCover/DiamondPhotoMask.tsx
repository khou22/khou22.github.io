import { getCdnAsset, getPhotoName, PhotoIdType } from "@/utils/cdn/cdnAssets";

type DiamondPhotoMaskProps = {
  photoID: PhotoIdType;
  left: number;
  top: number;
  width: number;
  height: number;
  borderColor?: string;
  borderWidth?: number;
};

export const DiamondPhotoMask: React.FC<DiamondPhotoMaskProps> = ({
  photoID,
  left,
  top,
  width,
  height,
  borderColor = "white",
  borderWidth = 0,
}) => {
  const innerWidth = width - borderWidth * 2;
  const innerHeight = height - borderWidth * 2;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        backgroundColor: borderColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: innerWidth,
          height: innerHeight,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      >
        <img
          src={getCdnAsset(photoID)}
          alt={getPhotoName(photoID)}
          style={{ width: innerWidth, height: innerHeight, objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
