import { CoordinatesLabel } from "@/components/atoms/CoordinatesLabel/CoordinatesLabel";
import { PhotoImage } from "@/components/atoms/PhotoImage/PhotoImage";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { PhotoGallery } from "@/components/organisms/PhotoGallery/PhotoGallery";
import { Label } from "@/components/ui/label";
import { PhotoTags } from "@/constants/photoTags";
import { getPhotosWithTags } from "@/data/photos/photoDbManager";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "San Francisco by Air | Kevin Hou Photography",
  description:
    "Kevin Hou Photography exhibiting San Francisco's beautiful views by air: drone, plane, satellite, and more.",
};

const AerialSfPage = async () => {
  const allPhotosIDs = await getPhotosWithTags([
    PhotoTags.Drone,
    PhotoTags.SanFrancisco,
  ]);

  return (
    <>
      <PageWrapper
        maxWidth="none"
        className="mt-10 grid h-auto grid-flow-row-dense grid-cols-2 gap-10 md:h-[88vh] md:max-h-[800px] md:grid-cols-5 xl:h-auto xl:max-h-none"
      >
        <div className="col-span-1 row-start-2 flex flex-col items-start justify-between space-y-12 md:row-start-auto md:h-full">
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
            <PhotoImage
              photoID="photography/Golden_Gate_Bridge_Aerial_Head_On_jpg"
              className="h-full w-full object-contain"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>

        <div className="col-span-2 col-start-1 flex h-full flex-col items-center space-y-4 md:col-start-auto">
          <div className="grid w-full grid-cols-5 md:h-2/3">
            <div className="relative col-span-3 h-full">
              <PhotoImage
                photoID="photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg"
                className="h-full w-full object-contain"
                isLink
                hoverAnimation="scale"
              />
            </div>
            <div className="col-span-2 flex items-center justify-center p-4">
              <div className="[&>p]:mb-4">
                <Label>Author</Label>
                <p className="caption">Kevin Hou</p>

                <Label>Project Duration</Label>
                <p className="caption">2017 - Present</p>

                <Label>Location</Label>
                <CoordinatesLabel
                  latitude={37.7790262}
                  longitude={-122.419906}
                />
              </div>
            </div>
          </div>
          <div className="flex h-1/3 flex-col items-start justify-center pb-10 pt-6 md:pb-0 md:pt-0">
            <h6 className="mb-6 text-gray-700">High above the streets of</h6>
            <h1 className="font-black">San Francisco</h1>
          </div>
        </div>

        <div className="col-span-1 flex h-full flex-col items-center justify-center pt-12 md:col-span-2">
          <div className="relative h-full w-full">
            <PhotoImage
              photoID="photography/Downtown_San_Francisco_Birds_Eye_View_Top_Down_Powell_Street_Intersection_Drone_jpg"
              className="h-full w-full object-contain"
              isLink
              hoverAnimation="scale"
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
        className="my-12 grid grid-cols-6 gap-2 md:my-24 md:grid-cols-12"
      >
        {/* First Row */}
        <div className="col-span-1" />
        <div className="col-span-5 flex h-full flex-row items-center justify-start space-x-2 md:col-span-3 md:flex-col">
          <div className="relative aspect-[4/5] w-full">
            <PhotoImage
              photoID="photography/San_Francisco_Lombard_Street_Sunrise_Drone_Vertical_jpg"
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
          <div>
            <p className="caption mt-2">Lombard Street at 6am, San Francisco</p>
            <CoordinatesLabel
              latitude={37.80181121826172}
              longitude={-122.42108917236328}
            />
          </div>
        </div>
        <div className="hidden md:col-span-3 md:block" />
        <div className="col-span-4">
          <div className="relative mt-36 aspect-square w-full">
            <PhotoImage
              photoID="photography/Downtown_San_Francisco_Drone_Vertical_Powell_Street_Intersection_jpg"
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center">
          <p className="caption">Market Street</p>
          <CoordinatesLabel
            latitude={37.78683207010421}
            longitude={-122.40317722776919}
          />
        </div>

        {/* Second Row */}
        <div className="relative col-span-5 h-full md:col-span-9">
          <PhotoImage
            photoID="photography/Main_Post_Presidio_San_Francisco_jpg"
            className="h-full w-full object-cover"
            isLink
            hoverAnimation="scale"
          />
        </div>
        <div className="col-span-1 flex aspect-[2/3] w-full flex-col items-start justify-end md:col-span-3">
          <p className="caption">Main Post, Presidio</p>
          <CoordinatesLabel
            latitude={37.80358670437733}
            longitude={-122.46400436380893}
          />
        </div>

        {/* Third Row */}
        <div className="col-span-5 flex h-full flex-col items-start justify-end pt-16 md:items-end md:pt-0">
          <p className="caption">Ferry Building</p>
          <CoordinatesLabel
            latitude={37.795829812869364}
            longitude={-122.39370902994662}
          />
        </div>
        <div className="col-span-3">
          <div className="relative aspect-[5/4] md:mt-16">
            <PhotoImage
              photoID="photography/Embarcadero_Drone_Ferry_Building_Night_Horizontal_jpg"
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-4" />

        {/* Fourth Row */}
        <div className="col-span-4 pl-16 md:col-span-7">
          <div className="relative mt-48 aspect-square">
            <PhotoImage
              photoID="photography/Bay_Bridge_at_Sunset_from_Plane_jpg"
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
        </div>
        <div className="col-span-2 flex h-full flex-col items-start justify-end">
          <p className="caption">Bay Bridge</p>
          <CoordinatesLabel
            latitude={37.8367032779192}
            longitude={-122.40002831438571}
          />
        </div>
        <div className="col-span-3">
          <div className="relative aspect-[2/3]">
            <PhotoImage
              photoID="photography/Lombard_Street_Drone_jpg"
              className="h-full w-full object-cover"
              isLink
              hoverAnimation="scale"
            />
          </div>
          <p className="caption text-center">Lombard Street</p>
          <CoordinatesLabel
            className="text-center"
            latitude={37.80181121826172}
            longitude={-122.42108917236328}
          />
        </div>
      </PageWrapper>

      <PageWrapper>
        <PhotoGallery photoIDs={allPhotosIDs} />
      </PageWrapper>
    </>
  );
};

export default AerialSfPage;
