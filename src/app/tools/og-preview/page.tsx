import { Metadata } from "next";
import { OGPreview } from "./OGPreview";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
    title: "OG Image Preview | Kevin Hou",
    description: "Preview how your content will appear when shared on social media platforms",
};

const OGPreviewPage = () => {
    return (
        <PageWrapper maxWidth="wide">
            <h1 className="mb-4 text-center leading-loose">OG Image Preview</h1>
            <p className="mb-6 text-center text-gray-600">
                Preview how your content will appear when shared on social media platforms.
                Generated images are 1200×630px (standard OG dimensions).
            </p>
            <OGPreview />
        </PageWrapper>
    );
};

export default OGPreviewPage;
