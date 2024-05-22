import { redirect } from "next/navigation";

import { PAGES } from "@/utils/pages";

const PhotoHome = () => {
  redirect(PAGES.PHOTOGRAPHY.HOME);
};

export default PhotoHome;
