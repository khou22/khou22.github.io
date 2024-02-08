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

      <div className="flex flex-row items-center justify-center space-x-2">
        <Link href="https://codeium.com" target="_blank">
          <Button variant="primary">Visit Codeium</Button>
        </Link>

        <Link
          href="https://github.com/Exafunction/codeium-react-code-editor"
          target="_blank"
        >
          <Button variant="outline">GitHub Repo</Button>
        </Link>
      </div>

      <p>Try it out using the Python editor below.</p>

      <img
        src="https://badge.fury.io/js/@codeium%2Freact-code-editor.svg"
        alt="Codeium badge"
        className="h-5"
      />

      <CodeiumEditor language="python" theme="vs-dark" height={500} />
    </PageWrapper>
  );
};

export default CodeiumDemoPage;
