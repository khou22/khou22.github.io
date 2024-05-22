import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

const NotFoundPage: React.FC = () => {
  return (
    <div className="relative">
      <img
        src={getCdnAsset("media/site/images/404_jpg")}
        alt="404 Not Found"
        className="h-full max-h-[90vh] w-full object-cover"
      />
      <div className="absolute left-1/2 top-3/4 z-10 -translate-x-1/2 -translate-y-1/2">
        <Link href={PAGES.HOME}>
          <Button variant="outline" className="min-w-[200px] text-white">
            Go Home
          </Button>
        </Link>
        <p className="m-auto mt-8 text-center text-sm text-white">
          This page was not found.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
