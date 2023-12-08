import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhotoIdType, getCdnAsset } from "@/utils/cdn/cdnAssets";

type PhotoManagementCardProps = {
  imageKey: PhotoIdType;
};

const tags = ["landscape", "engagements", "events", "concert", "portraits"];

export const PhotoManagementCard: React.FC<PhotoManagementCardProps> = ({
  imageKey,
}) => {
  return (
    <Card className="grid grid-cols-2 gap-4 p-2">
      <img className="h-48" src={getCdnAsset(imageKey)} />
      <div className="flex flex-col items-start justify-start space-y-2">
        {tags.map((tag) => (
          <div key={tag} className="flex items-center space-x-2">
            <Checkbox id={tag} />
            <Label htmlFor={tag}>{tag}</Label>
          </div>
        ))}
      </div>
    </Card>
  );
};
