import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const isAuthed = localStorage.getItem("auth") === "true";
  return (
    <div className="landing">
      <section className="landingHero">
        <div className="landingHeroContent">
          <h1 className="landingTitle">Shop smarter. Track everything.</h1>
          <p className="landingSubtitle">
            Build beautiful shopping lists, stay organized, and share with family.
          </p>
          <div className="landingCtas">
            {isAuthed ? (
              <Link to="/home" className="ctaPrimary">Go to App</Link>
            ) : (
              <>
                <Link to="/register" className="ctaPrimary">Get Started</Link>
                <Link to="/login" className="ctaSecondary">I have an account</Link>
              </>
            )}
          </div>
        </div>
        <div className="landingHeroArt">
          {/* Put your gif into src/assets/shoppingcart.gif */}
          <img
            className="landingGif"
            src="/src/assets/shoppingcart.gif"
            alt="Shopping cart animation"
          />
          <div className="glowBubble b1" />
          <div className="glowBubble b2" />
        </div>
      </section>

      <section className="landingFeatures">
        <div className="featCard">
          <div className="featIcon">📝</div>
          <h3>Create lists instantly</h3>
          <p>Make multiple lists, categorize items, and keep them synced.</p>
        </div>
        <div className="featCard">
          <div className="featIcon">👨‍👩‍👧‍👦</div>
          <h3>Share with family</h3>
          <p>Send a share link so everyone stays on the same page.</p>
        </div>
        <div className="featCard">
          <div className="featIcon">📱</div>
          <h3>Made for mobile</h3>
          <p>Clean, fast UI that shines on your phone while you shop.</p>
        </div>
      </section>
    </div>
  );
}
