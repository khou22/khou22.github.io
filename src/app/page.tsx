import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        id="landing-parallax-container"
        className="landing-parallax-container"
      >
        <div>
          <img
            className="landing-parallax-image"
            src={getCdnAsset("media/landing/hong_kong/0_png")}
          />
        </div>

        {/* Personal logo and name - second furthest back to give sense of depth */}
        <div>
          <span className="landing-parallax-container-content">
            <img
              className="landing-parallax-container-content-logo"
              src={getCdnAsset("media/site/logo/initials_logo_shadow_png")}
            />
            <img
              className="landing-parallax-container-content-logo"
              src={getCdnAsset("media/site/logo/initials_logo_animated_svg")}
            />
            <p className="landing-parallax-container-content-name">Kevin Hou</p>
          </span>
        </div>
        <div>
          <img
            className="landing-parallax-image"
            src={getCdnAsset("media/landing/hong_kong/1_png")}
          />
        </div>
        <div>
          <img
            className="landing-parallax-image"
            src={getCdnAsset("media/landing/hong_kong/2_png")}
          />
        </div>
      </div>
    </main>
  );
}
