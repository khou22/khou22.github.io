type ParallaxHoverCardProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Modified from: https://codepen.io/arixking/pen/EWKzvR
 */
export const ParallaxHoverCard: React.FC<ParallaxHoverCardProps> = ({
  className = "",
  children,
}) => {
  return (
    <div className={className}>
      <div className="parallax">
        <div className="parallax-top-left" />
        <div className="parallax-top-right" />
        <div className="parallax-bottom-left" />
        <div className="parallax-bottom-right" />
        <div className="parallax-content">{children}</div>
      </div>
    </div>
  );
};
