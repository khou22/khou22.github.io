"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PhotoTagUpdateRequest } from "../../../app/admin/photos/api/tags/types";
import { PhotoTags, tagMetadata } from "@/constants/photoTags";
import { enumToString } from "@/utils/enum";
import { classNames } from "@/utils/style";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsClient } from "@/api/TagsClient";
import { XIcon } from "@/components/icons/XIcon/XIcon";

type PhotoManagementCardProps = {
  imageKey: PhotoIdType;
  path: string;
  tagIDs: PhotoTags[];
};

export const PhotoManagementCard: React.FC<PhotoManagementCardProps> = ({
  imageKey,
  path,
  tagIDs,
}) => {
  const CategoryCheckbox = ({ tag }: { tag: PhotoTags }) => {
    const id = `${imageKey}-${tag}`;
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={tagIDs.includes(tag)}
          onCheckedChange={async (value) => {
            void new TagsClient().updateTags(imageKey, [
              { tagID: tag, value: Boolean(value) },
            ]);
          }}
        />
        <Label htmlFor={id}>{enumToString(tag, PhotoTags)}</Label>
      </div>
    );
  };

  const currentLocation = tagIDs.find((tag) => tag.startsWith("location_"));
  const onLocationChange = async (newLocation: PhotoTags) => {
    if (newLocation === currentLocation) {
      return;
    }

    const updates = [{ tagID: newLocation, value: true }];
    if (currentLocation) {
      updates.push({ tagID: currentLocation, value: false });
    }

    await new TagsClient().updateTags(imageKey, updates);
  };

  return (
    <Card
      className={classNames(
        "grid grid-cols-4 gap-4 p-2",
        tagIDs?.length > 0 ? "bg-green-100/30" : "",
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-2 px-2">
        <img
          className="h-52 rounded object-contain"
          src={getCdnAsset(imageKey)}
        />
        <p className="caption w-full break-all">{decodeURIComponent(path)}</p>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Category:</p>
        {Object.values(PhotoTags)
          .filter((tag) => tag.includes("category"))
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} tag={tag} />
          ))}
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Location</p>
        <Select value={currentLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-[180px] text-left">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Locations</SelectLabel>
              {Object.values(PhotoTags)
                .filter((tag) => tag.includes("location"))
                .map((tag: PhotoTags) => (
                  <SelectItem key={tag} value={tag}>
                    {tagMetadata[tag].name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          className="flex flex-row items-center justify-start space-x-1 text-sm text-red-500 hover:text-red-400"
          onClick={() => {
            if (currentLocation) {
              void new TagsClient().updateTags(imageKey, [
                { tagID: currentLocation, value: false },
              ]);
            }
          }}
        >
          <XIcon className="h-4 w-4" />
          <span>Clear Location</span>
        </button>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Other</p>
        {Object.values(PhotoTags)
          .filter(
            (tag) => !tag.includes("location") && !tag.includes("category"),
          )
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} tag={tag} />
          ))}
      </div>
    </Card>
  );
};
