"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PhotoTagUpdateRequest } from "./tags/types";

type PhotoManagementCardProps = {
  imageKey: PhotoIdType;
  tagIDs: string[];
};

const allTags = [
  "landscape",
  "engagements",
  "events",
  "concert",
  "portraits",
  "city",
];

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

  return (
    <Card className="grid grid-cols-2 gap-4 p-2">
      <img className="h-48" src={getCdnAsset(imageKey)} />
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Tags: {tagIDs.join(", ")}</p>
        {allTags.map((tag) => (
          <div key={tag} className="flex items-center space-x-2">
            <Checkbox
              id={tag}
              checked={tagIDs.includes(tag)}
              onCheckedChange={async (value) => {
                void updateTag(tag, Boolean(value));
              }}
            />
            <Label htmlFor={tag}>{tag}</Label>
          </div>
        ))}
      </div>
    </Card>
  );
};
