import dynamic from "next/dynamic";

// Use dynamic import with no SSR for the 3D component
const PersonalLogoViewer = dynamic(
  () => import("./PersonalLogoViewer").then((mod) => mod.PersonalLogoViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center">
        Loading 3D viewer...
      </div>
    ),
  },
);

export default function InitialsLogoViewerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">3D Logo Viewer</h1>
      <p className="mb-4">
        Drag to rotate, scroll to zoom, and right-click to pan the 3D model.
      </p>
      <PersonalLogoViewer />
    </div>
  );
}
