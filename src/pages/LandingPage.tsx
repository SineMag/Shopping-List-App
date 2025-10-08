import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import shoppingCartGif from "../assets/shopping cart.gif";

export default function LandingPage() {
  const isAuthed = localStorage.getItem("auth") === "true";
  const [gifSrc, setGifSrc] = useState(shoppingCartGif);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Assuming the GIF loop duration is ~3 seconds, play twice = 6 seconds
    const timer = setTimeout(() => {
      // Freeze the GIF by capturing it to canvas
      if (imgRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Replace the GIF with the canvas image
          const frozenFrame = canvas.toDataURL('image/png');
          setGifSrc(frozenFrame);
        }
      }
    }, 6000); // 6 seconds for 2 loops

    return () => clearTimeout(timer);
  }, []);

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
          <img
            ref={imgRef}
            className="landingGif"
            src={gifSrc}
            alt="Shopping cart animation"
            crossOrigin="anonymous"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
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
          <h3>Made for mobile Too</h3>
          <p>Clean, fast UI that shines on your phone while you shop.</p>
        </div>
      </section>
    </div>
  );
}
