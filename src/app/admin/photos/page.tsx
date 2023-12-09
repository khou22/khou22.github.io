import { PAGES } from "@/utils/pages";
import { redirect } from "next/navigation";

export const PhotoPageHome = () => {
  redirect(PAGES.ADMIN.PHOTO(1));
};
