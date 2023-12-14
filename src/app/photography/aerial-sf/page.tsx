import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Label } from "@/components/ui/label";
import { getCdnAsset, getPhotoName } from "@/utils/cdn/cdnAssets";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "San Francisco by Air | Kevin Hou Photography",
  description:
    "Kevin Hou Photography exhibiting San Francisco's beautiful views by air: drone, plane, satellite, and more.",
};

const AerialSfPage = () => {
  return (
    <>
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
                <p className="caption font-mono">37.7749° N, 122.4194° W</p>
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

      <PageWrapper maxWidth="wide" className="my-12 md:my-24">
        <h1
          className="text-mask w-full text-center text-[8rem] font-black md:text-[12rem] xl:text-[16rem]"
          style={{
            // TODO: Consider making this a GIF of this drone flyover.
            backgroundImage: `url(${getCdnAsset(
              "photography/San_Francisco_Downtown_Twilight_Sunset_Drone_Panorama_jpg",
            )})`,
          }}
        >
          The 415
        </h1>
      </PageWrapper>
      <PageWrapper
        maxWidth="wide"
        className="my-12 grid grid-cols-12 gap-2 md:my-24"
      >
        {/* First Row */}
        <div className="col-span-1" />
        <div className="col-span-3 flex h-full flex-col items-center justify-start">
          <div className="relative aspect-[4/5] w-full">
            <Image
              alt={getPhotoName(
                "photography/Lombard_Street_with_Golden_Gate_in_Background_via_Drone_jpg",
              )}
              src={getCdnAsset(
                "photography/Lombard_Street_with_Golden_Gate_in_Background_via_Drone_jpg",
              )}
              className="object-cover"
              fill
            />
          </div>
          <p className="caption mt-2">Lombard Street, San Francisco</p>
          <p className="caption font-mono">37.8022° N, 122.4178° W</p>
        </div>
        <div className="col-span-3" />
        <div className="col-span-4">
          <div className="relative mt-36 aspect-square w-full">
            <Image
              alt={getPhotoName(
                "photography/Downtown_San_Francisco_Drone_Vertical_Powell_Street_Intersection_jpg",
              )}
              src={getCdnAsset(
                "photography/Downtown_San_Francisco_Drone_Vertical_Powell_Street_Intersection_jpg",
              )}
              className="object-cover"
              fill
            />
          </div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center">
          <p className="caption">Market Street</p>
          <p className="caption font-mono">37.7877° N, 122.4033° W</p>
        </div>

        {/* Second Row */}
        <div className="relative col-span-9 h-full">
          <Image
            src={getCdnAsset(
              "photography/Main_Post_Presidio_San_Francisco_jpg",
            )}
            alt={getPhotoName(
              "photography/Main_Post_Presidio_San_Francisco_jpg",
            )}
            className="object-cover"
            fill
          />
        </div>
        <div className="col-span-3 flex aspect-[2/3] w-full flex-col items-start justify-end">
          <p className="caption">Main Post, Presidio</p>
          <p className="caption font-mono">37.8008° N, 122.4568° W</p>
        </div>

        {/* Third Row */}
        <div className="col-span-5 flex h-full flex-col items-end justify-center">
          <p className="caption">Main Post, Presidio</p>
          <p className="caption font-mono">37.8008° N, 122.4568° W</p>
        </div>
        <div className="col-span-3">
          <div className="relative mt-16 aspect-[5/4]">
            <Image
              src={getCdnAsset(
                "photography/Main_Post_Presidio_San_Francisco_jpg",
              )}
              alt={getPhotoName(
                "photography/Main_Post_Presidio_San_Francisco_jpg",
              )}
              className="object-cover"
              fill
            />
          </div>
        </div>
        <div className="col-span-3 aspect-square" />
      </PageWrapper>
    </>
  );
};

export default AerialSfPage;
