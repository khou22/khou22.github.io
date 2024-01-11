import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { MenuIcon } from "@/components/icons/MenuIcon/MenuIcon";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PAGES } from "@/utils/pages";

type MobileNavLinks = {
  title: string;
  href: string;
};

const navLinks: MobileNavLinks[] = [
  {
    title: "Home",
    href: PAGES.HOME,
  },
  {
    title: "Photography",
    href: PAGES.PHOTOGRAPHY.HOME,
  },
  {
    title: "Wood",
    href: PAGES.WOOD,
  },
  {
    title: "Blog",
    href: PAGES.BLOG,
  },
  {
    title: "Contact",
    href: PAGES.CONTACT,
  },
];

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">
          <span className="sr-only">Open nav bar</span>
          <MenuIcon className="block h-5 w-5 md:hidden" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <PersonalLogo className="h-10 w-10" />
          <SheetTitle>Kevin Hou&apos;s Website</SheetTitle>
          <SheetDescription>
            Personal projects, photography print store, woodshop gallery, blog,
            and more.
          </SheetDescription>
        </SheetHeader>
        <div className="my-4 flex w-full grow flex-col space-y-2">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.title}>
              <CustomLink href={link.href}>{link.title}</CustomLink>
            </SheetClose>
          ))}
        </div>
        <SheetFooter>
          <SocialLinks className="my-3 space-x-2" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
