import Link from "next/link";

import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { privatePhotoAlbums } from "@/constants/privatePhotoAlbums";
import { PAGES } from "@/utils/pages";
import { getPhotoIDs } from "@/utils/photos/getPhotoIDs";

import { PhotoSearchForm } from "./PhotoSearchForm";

const PhotoPageHome = () => {
  // Parse all subdirectory folders from our list of photo IDs.
  const subdirectoryOptions = new Set<string>();
  getPhotoIDs().forEach((id) => {
    const pathComponents = id.split("/");
    const subDirs = pathComponents.slice(1, pathComponents.length - 1);
    if (subDirs.length != 0) {
      subdirectoryOptions.add(subDirs.join("/"));
    }
  });

  return (
    <PageWrapper>
      <h1>Photo Admin</h1>
      <p>Manage photos and their tags.</p>

      <Link href={PAGES.ADMIN.ALL_PHOTOS(1)}>
        <Button>All Photos</Button>
      </Link>

      <div className="my-4 w-full">
        <Label>Search for Photo</Label>
        <PhotoSearchForm />
      </div>

      <div className="my-4 w-full">
        <Label>Navigate Subdirectory</Label>
        <ul>
          {Array.from(subdirectoryOptions.values()).map((subDir) => (
            <CustomLink
              key={subDir}
              href={PAGES.ADMIN.SUBDIRECTORY(subDir)}
              className="group"
            >
              <li>
                <span className="inline-block group-hover:hidden">📁</span>
                <span className="hidden group-hover:inline-block">📂</span>{" "}
                {subDir}/
              </li>
            </CustomLink>
          ))}
        </ul>
      </div>

      <div className="my-4 w-full">
        <Label>Shareable Albums 🔗</Label>
        <ul>
          {privatePhotoAlbums.map((album) => (
            <CustomLink
              key={album.id}
              href={PAGES.SHARE.ALBUM(album.id)}
              className="group"
            >
              <li>{album.name}</li>
            </CustomLink>
          ))}
        </ul>
      </div>
    </PageWrapper>
  );
};

export default PhotoPageHome;
