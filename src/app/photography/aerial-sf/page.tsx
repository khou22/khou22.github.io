import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Label } from "@/components/ui/label";
import { getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import Image from "next/image";

const AerialSfPage = () => {
  return (
    <PageWrapper
      maxWidth="none"
      className="mt-10 grid h-[88vh] max-h-[800px] grid-cols-5 gap-10"
    >
      <div className="col-span-1 flex h-full flex-col items-start justify-between space-y-12">
        <div className="flex min-h-[30%] flex-col items-center justify-center">
          <h3 className="italic">
            Birds
            <br />
            Eye
            <br />
            View.
          </h3>
        </div>
        <div className="relative w-full grow">
          <Image
            alt={getPhotoName(
              "photography/Golden_Gate_Bridge_Aerial_Head_On_jpg",
            )}
            src={getCdnAsset(
              "photography/Golden_Gate_Bridge_Aerial_Head_On_jpg",
            )}
            className="object-contain"
            fill
          />
        </div>
      </div>

      <div className="col-span-2 flex h-full flex-col items-center space-y-4">
        <div className="grid h-2/3 w-full grid-cols-5">
          <div className="relative col-span-3 h-full">
            <Image
              alt={getPhotoName(
                "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
              )}
              src={getCdnAsset(
                "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
              )}
              className="object-contain"
              fill
            />
          </div>
          <div className="col-span-2 flex items-center justify-center p-4">
            <div className="[&>p]:mb-4">
              <Label>Author</Label>
              <p className="caption">Kevin Hou</p>

              <Label>Project Duration</Label>
              <p className="caption">2017 - Present</p>

              <Label>Location</Label>
              <p className="caption font-mono">-27.129042, +58.219024</p>
            </div>
          </div>
        </div>
        <div className="flex h-1/3 flex-col items-start justify-center">
          <h6 className="mb-6 text-gray-700">High above the streets of</h6>
          <h1 className="font-black">San Francisco</h1>
        </div>
      </div>

      <div className="col-span-2 flex h-full flex-col items-center justify-center pt-12">
        <div className="relative h-full w-full">
          <Image
            alt={getPhotoName(
              "photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg",
            )}
            src={getCdnAsset(
              "photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg",
            )}
            className="object-contain"
            fill
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default AerialSfPage;
