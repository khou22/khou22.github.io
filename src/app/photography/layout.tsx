import { Snipcart } from "./Snipcart";

/**
 * Nested layout for all /photography routes.
 */
export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Snipcart />
      {children}
    </>
  );
}
