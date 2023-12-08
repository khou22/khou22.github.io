type PhotoManagementCardProps = {
  imagePath: string;
};

export const PhotoManagementCard: React.FC<PhotoManagementCardProps> = ({
  imagePath,
}) => {
  return <img src={imagePath} />;
};
