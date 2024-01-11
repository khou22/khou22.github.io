import { Photo } from "react-photo-album";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

export type PhotoRecord = { photoID: PhotoIdType } & Photo;
