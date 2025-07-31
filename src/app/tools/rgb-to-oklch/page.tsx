import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { RgbToOklchClient } from "./RgbToOklchClient";

const RgbToOklchPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">RGB to OKLCH Converter</h1>
      <RgbToOklchClient />
    </PageWrapper>
  );
};

export default RgbToOklchPage;
