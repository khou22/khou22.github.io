import { Metadata } from "next";
import { PasswordGenerator } from "./PasswordGenerator";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Password Generator | Kevin Hou",
};

const PasswordGeneratorPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Password Generator</h1>
      <PasswordGenerator />
    </PageWrapper>
  );
};

export default PasswordGeneratorPage;
