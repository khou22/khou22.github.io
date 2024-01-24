import Link from "next/link";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

const CodeiumDemoPage = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center space-y-4">
      <div>
        <h1 className="m-auto text-center leading-loose">Codeium</h1>
        <p className="w-full text-center">Your modern coding superpower.</p>
      </div>

      <Link href="https://codeium.com" target="_blank">
        <Button variant="primary">Visit Codeium</Button>
      </Link>

      <p>Try it out using the Python editor below.</p>

      <CodeiumEditor language="python" theme="vs-dark" />
    </PageWrapper>
  );
};

export default CodeiumDemoPage;
