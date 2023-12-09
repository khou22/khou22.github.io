"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PhotoTagUpdateRequest } from "../tags/types";
import { PhotoTags } from "@/constants/photoTags";
import { enumToString } from "@/utils/enum";

type PhotoManagementCardProps = {
  imageKey: PhotoIdType;
  tagIDs: string[];
};

export const PhotoManagementCard: React.FC<PhotoManagementCardProps> = ({
  imageKey,
  tagIDs,
}) => {
  const updateTag = async (tagID: string, value: boolean) => {
    const request: PhotoTagUpdateRequest = {
      photoID: imageKey,
      addTags: value ? [tagID] : [],
      removeTags: value ? [] : [tagID],
    };
    const response = await fetch(`/admin/photos/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      console.error(response);
    }
  };

  const CategoryCheckbox = ({ tag }: { tag: PhotoTags }) => {
    const id = `${imageKey}-${tag}`;
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={tagIDs.includes(tag)}
          onCheckedChange={async (value) => {
            void updateTag(tag, Boolean(value));
          }}
        />
        <Label htmlFor={id}>{enumToString(tag, PhotoTags)}</Label>
      </div>
    );
  };

  return (
    <Card className="grid grid-cols-4 gap-4 p-2">
      <div>
        <img className="h-48 object-contain" src={getCdnAsset(imageKey)} />
        <p className="caption w-full break-all">{imageKey}</p>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Category:</p>
        {Object.values(PhotoTags)
          .filter((tag) => tag.includes("category"))
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} photoID={imageKey} tag={tag} />
          ))}
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Location</p>
        {Object.values(PhotoTags)
          .filter((tag) => tag.includes("location"))
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} photoID={imageKey} tag={tag} />
          ))}
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Other</p>
        {Object.values(PhotoTags)
          .filter(
            (tag) => !tag.includes("location") && !tag.includes("category"),
          )
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} photoID={imageKey} tag={tag} />
          ))}
      </div>
    </Card>
  );
};
