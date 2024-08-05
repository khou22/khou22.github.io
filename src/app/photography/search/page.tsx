import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

const SearchPage = async ({
  searchParams,
}: {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  console.log(searchParams);
  return (
    <PageWrapper maxWidth="wide">
      <h1>Search</h1>
    </PageWrapper>
  );
};

export default SearchPage;
