import { classNames } from "@/utils/style";
import Image from "next/image";
import Link from "next/link";

type FullCoverArticleProps = {
  href: string;
  imageSrc: string;
  width?: 1 | 2;
  title: string;
  category: string;
  description: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const FullCoverArticle: React.FC<FullCoverArticleProps> = ({
  href,
  imageSrc,
  title,
  category,
  description,
  width = 1,
  priority,
  className = "",
  style,
}) => {
  const sizeClassName = width === 2 ? "col-span-1 sm:col-span-2" : "col-span-1";
  return (
    <Link
      href={href}
      style={style}
      className={classNames("group", sizeClassName, className)}
    >
      <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded shadow md:min-h-[400px] xl:min-h-[500px]">
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center space-y-4 text-white">
          <p className="text-sm text-gray-200">{category.toUpperCase()}</p>
          <h3>{title}</h3>
          <span
            className={classNames(
              "border-b-2 border-white",
              width === 2 ? "w-12" : "w-6",
            )}
          />
          <p className="text-center">{description}</p>
        </div>
        <Image
          src={imageSrc}
          alt={title}
          className="object-cover brightness-100 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75"
          fill
          priority={priority}
        />
      </div>
    </Link>
  );
};
