import Link from "next/link";
import Image from "next/image";
import { classNames } from "@/utils/style";

type HalfTextArticleProps = {
  href: string;
  imageSrc: string;
  title: string;
  category: string;
  description: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const HalfTextArticle: React.FC<HalfTextArticleProps> = ({
  href,
  imageSrc,
  title,
  category,
  description,
  priority,
  className = "",
  style,
}) => {
  return (
    <Link
      href={href}
      style={style}
      className={classNames("group col-span-1", className)}
    >
      <div className="flex h-full flex-col justify-evenly overflow-clip rounded bg-blue-800 shadow">
        <div className="relative aspect-square w-full">
          <Image
            src={imageSrc}
            alt={title}
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            fill
            priority={priority}
          />
        </div>
        <div className="flex h-1/2 w-full flex-col items-center justify-center space-y-4 px-2 py-4 text-white sm:py-8">
          <p className="text-sm text-gray-400">{category.toUpperCase()}</p>
          <h5>{title}</h5>
          <span className="w-6 border-b border-white" />
          <p className="text-center text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};
