import Link from "next/link";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { ContextAwareDemo } from "./ContextAwareDemo";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

const CodeiumDemoPage = () => {
  return (
    <>
      <PageWrapper className="flex flex-col items-center justify-center space-y-4">
        <div>
          <h1 className="m-auto text-center leading-loose">Codeium</h1>
          <div className="mb-8 flex flex-row items-center justify-center space-x-2">
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
          <p className="mb-4 w-full text-center">
            Codeium React Code Editor is a free, open-source code editor as a
            React component with unlimited AI autocomplete. Brought to you by
            the team at <Link href="https://codeium.com">Codeium</Link>. Free
            with no account required. All you need to do is install our NPM
            package, add it to your website and you&apos;re good to go!
          </p>
          <Link
            href="https://github.com/Exafunction/codeium-react-code-editor"
            target="_blank"
          >
            <img
              src="https://badge.fury.io/js/@codeium%2Freact-code-editor.svg"
              alt="Codeium badge"
              className="m-auto h-5"
            />
          </Link>
        </div>

        <div>
          <h3 className="m-auto text-center">Basic Use Case</h3>
          <p className="w-full text-center">
            Try it out using the Python editor below.
          </p>
        </div>

        <CodeiumEditor language="python" theme="vs-dark" height={450} />
      </PageWrapper>

      <PageWrapper
        maxWidth="wide"
        className="mt-6 flex flex-col items-center justify-center space-y-4"
      >
        <div>
          <h3 className="m-auto text-center">Advanced Use Case</h3>
          <p className="w-full text-center">
            These two editors are context-aware. This means that they can use
            each other&apos;s content as context when generating suggestions.
          </p>
        </div>

        <ContextAwareDemo />
      </PageWrapper>
    </>
  );
};

export default CodeiumDemoPage;
