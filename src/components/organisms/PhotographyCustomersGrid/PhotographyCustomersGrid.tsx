import { photographyCustomers } from "@/constants/photographyCustomers";
import { classNames } from "@/utils/style";

type PhotographyCustomersGridProps = {
  className?: string;
};

export const PhotographyCustomersGrid: React.FC<
  PhotographyCustomersGridProps
> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 md:gap-8 lg:gap-12",
        className,
      )}
    >
      {photographyCustomers.map(({ name, logo, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-full w-full flex-col items-center justify-between"
        >
          <img
            src={logo}
            alt={name}
            className="aspect-[3/2] w-full object-contain opacity-80 saturate-0 transition duration-200 group-hover:opacity-100 group-hover:saturate-100"
          />
          <p className="caption text-center opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            {name}
          </p>
        </a>
      ))}
    </div>
  );
};
