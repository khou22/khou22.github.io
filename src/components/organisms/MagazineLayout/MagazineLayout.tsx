type MagazineLayoutProps = {
  children: React.ReactNode;
};

export const MagazineLayout: React.FC<MagazineLayoutProps> = ({ children }) => {
  return (
    <div className="grid w-full grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 lg:gap-6 xl:grid-cols-4">
      {children}
    </div>
  );
};
