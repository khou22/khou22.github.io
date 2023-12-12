import { PAGES } from "@/utils/pages";
import { redirect } from "next/navigation";

const PhotoPageHome = () => {
  redirect(PAGES.ADMIN.PHOTO(1));
};

export default PhotoPageHome;
