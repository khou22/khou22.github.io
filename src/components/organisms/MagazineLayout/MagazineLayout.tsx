type MagazineLayoutProps = {
  children: React.ReactNode;
};

export const MagazineLayout: React.FC<MagazineLayoutProps> = ({ children }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
};
