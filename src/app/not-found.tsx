import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Image
        fill
        objectFit="cover"
        src={getCdnAsset("media/site/images/404_jpg")}
        alt="404 Not Found"
      />
      <div className="fixed left-1/2 top-3/4 z-10 -translate-x-1/2 -translate-y-1/2">
        <Link href={PAGES.HOME}>
          <Button variant="outline" className="min-w-[200px] text-white">
            Go Home
          </Button>
        </Link>
        <p className="m-auto mt-8 text-center text-sm text-white">
          This page was not found.
        </p>
      </div>
    </>
  );
};

export default NotFoundPage;
