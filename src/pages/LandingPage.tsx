import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { FaLayerGroup, FaListCheck, FaUsers } from "react-icons/fa6";

export default function LandingPage() {
  const isAuthed = localStorage.getItem("auth") === "true";

  return (
    <div className="landing">
      <section className="landingHero">
        <div className="landingHeroContent">
          <p className="landingKicker">Shopping List App</p>
          <h1 className="landingTitle">Clean planning for everyday shopping.</h1>
          <p className="landingSubtitle">
            Build lists, organise categories, and move through your grocery run
            without clutter or dead-end navigation.
          </p>
          <div className="landingCtas">
            {isAuthed ? (
              <Link to="/home" className="ctaPrimary">
                Open Home
              </Link>
            ) : (
              <>
                <Link to="/register" className="ctaPrimary">
                  Get Started
                </Link>
                <Link to="/login" className="ctaSecondary">
                  I have an account
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="landingHeroArt">
          <div className="landingCartShell" aria-hidden="true">
            <BsCart4 size={108} />
            <div className="landingMiniCard">
              <span>Ready to buy</span>
              <strong>Milk, fruit, bread</strong>
            </div>
          </div>
          <div className="glowBubble b1" />
          <div className="glowBubble b2" />
        </div>
      </section>

      <section className="landingFeatures">
        <div className="featCard">
          <div className="featIcon">
            <FaListCheck />
          </div>
          <h3>Create lists instantly</h3>
          <p>Start a list quickly and keep every item grouped where it belongs.</p>
        </div>
        <div className="featCard">
          <div className="featIcon">
            <FaUsers />
          </div>
          <h3>Move with your household</h3>
          <p>Keep everyone aligned on what is needed before you get to the store.</p>
        </div>
        <div className="featCard">
          <div className="featIcon">
            <FaLayerGroup />
          </div>
          <h3>Designed around essentials</h3>
          <p>Lists, categories, and profile tools stay visible without visual noise.</p>
        </div>
      </section>
    </div>
  );
}
