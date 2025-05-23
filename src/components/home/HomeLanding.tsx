import React from "react";
import style from "./HomeLanding.module.scss";
import { useNavigate } from "react-router-dom";
import { TransitionOnScroll } from "../../hooks/TransitionOnScroll";

export const HomeLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/products/1");
  };

  return (
    <div>
      <div className={style["home-container"]}>
        <div className={style["branding"]}>
          <img className={style["car-logo"]} src="/logo_car.svg" alt="logo" />
          <img className={style["text-logo"]} src="/logo_text.svg" alt="logo" />
        </div>
        <div className={style["home"]}>
          <div className={style["home-text"]}>
            Transform your ride, <br />
            Elevate your style!
          </div>
          <img className={style["home-image"]} src="/couple.png" alt="home" />
          <button className={style["home-button"]} onClick={handleSubmit}>
            Shop Now
          </button>
        </div>
      </div>
      <div className={style["strengths-container"]}>
        <div>
          <h1>Why Our Customizable Car Air Fresheners Stand Out</h1>
        </div>
        <div className={style["strengths-item"]}>
          <TransitionOnScroll direction="right" timeout={300}>
            <h2>Unlimited Customization</h2>
          </TransitionOnScroll>

          <TransitionOnScroll direction="right" timeout={300}>
            <p>
              Express your style with personalized designs and shapes, perfect
              for any car.
            </p>
          </TransitionOnScroll>
        </div>
        <div className={style["strengths-item"]}>
          <TransitionOnScroll direction="right" timeout={300}>
            <h2>High-Quality Materials</h2>
          </TransitionOnScroll>

          <TransitionOnScroll direction="right" timeout={300}>
            <p>Crafted from durable materials, high-resolution prints.</p>
          </TransitionOnScroll>
        </div>
        <div className={style["strengths-item"]}>
          <TransitionOnScroll direction="right" timeout={300}>
            <h2>Versatile and Practical</h2>
          </TransitionOnScroll>

          <TransitionOnScroll direction="right" timeout={300}>
            <p>
              Perfect for personal use, gifts, or promotional items. Easy to
              customize to your liking.
            </p>
          </TransitionOnScroll>
        </div>
      </div>
      <div className={style["customize-container"]}>
        <div className={style["subtitle"]}> FEATURES </div>
        <div className={style["title"]}>Customize your own air freshener!</div>
        <div className={style["customize-tutorial"]}>
          <TransitionOnScroll direction="right" timeout={400}>
            <div className={style["customize-tutorial-item-left"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>1. Generate or Upload an Image</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="left" timeout={400}>
            <div className={style["customize-tutorial-item-right"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>2. Select a Shape</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="right" timeout={400}>
            <div className={style["customize-tutorial-item-left"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>3. Remove Background Image</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="left" timeout={400}>
            <div className={style["customize-tutorial-item-right"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>4. Resize the Image</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="right" timeout={400}>
            <div className={style["customize-tutorial-item-left"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>5. Add Text</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="left" timeout={400}>
            <div className={style["customize-tutorial-item-right"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>6. Draw Outline</h2>
              </div>
            </div>
          </TransitionOnScroll>
          <TransitionOnScroll direction="right" timeout={400}>
            <div className={style["customize-tutorial-item-left"]}>
              <div className={style["customize-tutorial-item"]}>
                <h2>7. Preview and Order</h2>
              </div>
            </div>
          </TransitionOnScroll>
        </div>
      </div>
    </div>
  );
};
