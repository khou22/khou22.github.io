"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import { PhotoTags } from "@/constants/photoTags/photoTags";
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
import { PhotoMetadataClient } from "@/api-clients/PhotoMetadataClient";
import { XIcon } from "@/components/icons/XIcon/XIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileLocationClient } from "@/api-clients/FileLocationClient";
import { Switch } from "@/components/ui/switch";
import { PAGES } from "@/utils/pages";
import { RatingInput } from "@/components/atoms/RatingInput/RatingInput";
import { tagMetadata } from "@/constants/photoTags/tagMetadata";

type PhotoManagementCardProps = {
  imageKey: PhotoIdType;
  path: string;
  tagIDs: PhotoTags[];
  rating: number;
};

export const PhotoManagementCard: React.FC<PhotoManagementCardProps> = ({
  imageKey,
  path,
  tagIDs,
  rating,
}) => {
  const [filePath, setFilePath] = useState(decodeURIComponent(path));

  const CategoryCheckbox = ({ tag }: { tag: PhotoTags }) => {
    const id = `${imageKey}-${tag}`;
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={tagIDs.includes(tag)}
          onCheckedChange={async (value) => {
            void new PhotoMetadataClient().updateTags(imageKey, [
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

    await new PhotoMetadataClient().updateTags(imageKey, updates);
  };

  const onPathChange = async (newPath: string) => {
    try {
      await new FileLocationClient().movePhotoPath(imageKey, newPath);
      toast("Photo Moved", {
        description: imageKey,
      });
    } catch (e) {
      if (e instanceof Error) {
        toast("Error Moving", {
          description: e.message,
        });
      }
    }
  };

  const onDelete = async () => {
    try {
      await new FileLocationClient().deletePhoto(imageKey);
      toast("Photo Deleted", {
        description: imageKey,
      });
    } catch (e) {
      if (e instanceof Error) {
        toast("Error Deleting", {
          description: e.message,
        });
      }
    }
  };

  return (
    <Card
      className={classNames(
        "grid grid-cols-4 gap-4 p-2",
        tagIDs?.length > 0 ? "bg-green-100/30" : "",
      )}
    >
      <div className="col-span-full">
        <h5 className="leading-relaxed">{getPhotoName(imageKey)}</h5>
        <p className="caption w-full break-all">{imageKey}</p>
        <p className="caption w-full">
          Path:{" "}
          <span className="break-all font-mono">
            {decodeURIComponent(path)}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <img
          alt={getPhotoName(imageKey)}
          className="max-h-64 rounded object-contain"
          src={getCdnAsset(imageKey)}
        />
        <Link href={PAGES.PHOTOGRAPHY.PHOTO(imageKey)} target="_blank">
          <Button variant="outline">Go to Photo</Button>
        </Link>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Category:</p>
        {Object.values(PhotoTags)
          .filter((tag) => tag.includes("category"))
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} tag={tag} />
          ))}
      </div>
      <div className="flex flex-col items-start justify-start space-y-4">
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

          {currentLocation && (
            <button
              className="flex flex-row items-center justify-start space-x-1 text-sm text-red-500 hover:text-red-400"
              onClick={() => {
                if (currentLocation) {
                  void new PhotoMetadataClient().updateTags(imageKey, [
                    { tagID: currentLocation, value: false },
                  ]);
                }
              }}
            >
              <XIcon className="h-4 w-4" />
              <span>Clear Location</span>
            </button>
          )}
        </div>
        <div>
          <p>For Sale</p>
          <Switch
            checked={!tagIDs.includes(PhotoTags.NotForSale)}
            onCheckedChange={(v) => {
              new PhotoMetadataClient().updateTags(imageKey, [
                { tagID: PhotoTags.NotForSale, value: !v },
              ]);
            }}
          />
        </div>
        <div>
          <p>Rating</p>
          <RatingInput
            value={rating ?? 0}
            onChange={async (v) => {
              try {
                const client = new PhotoMetadataClient();
                await client.updateRating(imageKey, v);
                toast("Rating Updated", {
                  description: imageKey,
                });
              } catch (e) {
                if (e instanceof Error) {
                  toast("Error Rating", {
                    description: e.message,
                  });
                }
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start space-y-2">
        <p>Other</p>
        {Object.values(PhotoTags)
          .filter(
            (tag) =>
              !tag.includes("location") &&
              !tag.includes("category") &&
              !tag.includes("store"),
          )
          .map((tag: PhotoTags) => (
            <CategoryCheckbox key={tag} tag={tag} />
          ))}
      </div>
      <div className="col-span-full">
        <Label>File Path</Label>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="File Path"
            placeholder="File Path"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
          />
          <Button
            type="submit"
            disabled={decodeURIComponent(path) === filePath}
            onClick={() => onPathChange(filePath)}
          >
            Move File
          </Button>
        </div>
      </div>
      <div className="col-span-full">
        <Label>Other Actions</Label>
        <div className="my-1">
          <Button variant="destructive" onClick={onDelete}>
            Delete Photo
          </Button>
        </div>
      </div>
    </Card>
  );
};
