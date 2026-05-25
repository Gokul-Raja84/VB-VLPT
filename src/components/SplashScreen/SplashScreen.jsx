import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

// Splash timing controls:
// - totalSplashDuration: how long the splash holds before fade-out starts.
// - reducedMotionDuration: shortened hold for users who prefer reduced motion.
// - fadeOutDuration: overlay fade-out time after the hold completes.
// - netReveal: volleyball net background draw-in timing.
// - textReveal/logoShine: VPVC reveal and gradient sweep timings.
// - ball.duration: total speed of the full ball path. Increase for slower motion.
// - ball.delay: when the ball starts after splash mount.
// - ball bounce point: edit the 48% frame in `ballBounceExit` inside
//   SplashScreen.module.css to change the exact impact pose/location.
// - credit: bottom credit fade-in timing.
const ANIMATION_TIMINGS = {
  totalSplashDuration: 5000,
  reducedMotionDuration: 450,
  fadeOutDuration: 260,
  netReveal: { duration: 900, delay: 80 },
  textReveal: {
    eyebrowDuration: 420,
    eyebrowDelay: 460,
    logoDuration: 620,
    logoDelay: 610,
  },
  logoShine: { duration: 1300, delay: 850 },
  ball: { duration: 1500, delay: 420 },
  credit: { duration: 420, delay: 1520 },
};

function ms(value) {
  return `${value}ms`;
}

const splashStyle = {
  "--splash-fade-out": ms(ANIMATION_TIMINGS.fadeOutDuration),
  "--net-reveal-duration": ms(ANIMATION_TIMINGS.netReveal.duration),
  "--net-reveal-delay": ms(ANIMATION_TIMINGS.netReveal.delay),
  "--eyebrow-duration": ms(ANIMATION_TIMINGS.textReveal.eyebrowDuration),
  "--eyebrow-delay": ms(ANIMATION_TIMINGS.textReveal.eyebrowDelay),
  "--logo-reveal-duration": ms(ANIMATION_TIMINGS.textReveal.logoDuration),
  "--logo-reveal-delay": ms(ANIMATION_TIMINGS.textReveal.logoDelay),
  "--logo-shine-duration": ms(ANIMATION_TIMINGS.logoShine.duration),
  "--logo-shine-delay": ms(ANIMATION_TIMINGS.logoShine.delay),
  "--ball-duration": ms(ANIMATION_TIMINGS.ball.duration),
  "--ball-delay": ms(ANIMATION_TIMINGS.ball.delay),
  "--credit-duration": ms(ANIMATION_TIMINGS.credit.duration),
  "--credit-delay": ms(ANIMATION_TIMINGS.credit.delay),
};

export default function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const holdDuration = reduceMotion
      ? ANIMATION_TIMINGS.reducedMotionDuration
      : ANIMATION_TIMINGS.totalSplashDuration;

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, holdDuration);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, holdDuration + ANIMATION_TIMINGS.fadeOutDuration);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`${styles.overlay} ${isExiting ? styles.exiting : ""}`}
      style={splashStyle}
      role="status"
      aria-live="polite"
      aria-label="VPVC is loading"
    >
      <span className="sr-only">VPVC launch animation</span>
      <div className={styles.netLayer} aria-hidden="true" />

      <div className={styles.stage} aria-hidden="true">
        <span className={styles.topTag}>Volleyball</span>
        <div className={styles.brandWrap}>
          <span className={styles.brand} data-text="VPVC">
            VPVC
          </span>
        </div>

        <div className={styles.ballTrack}>
          <div className={styles.ball}>
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="ballYellow" cx="32%" cy="22%" r="78%">
                  <stop offset="0%" stopColor="#FFE56B" />
                  <stop offset="55%" stopColor="#FFD000" />
                  <stop offset="100%" stopColor="#DFA900" />
                </radialGradient>
                <radialGradient id="ballBlue" cx="32%" cy="20%" r="82%">
                  <stop offset="0%" stopColor="#5D8DFF" />
                  <stop offset="58%" stopColor="#1A54E8" />
                  <stop offset="100%" stopColor="#1236A4" />
                </radialGradient>
                <clipPath id="ballClip">
                  <circle cx="22" cy="22" r="20" />
                </clipPath>
              </defs>

              <circle
                cx="22"
                cy="22"
                r="20"
                fill="url(#ballYellow)"
              />
              <g clipPath="url(#ballClip)">
                <path
                  d="M-2 15 C8 12 15 12 22 15 C29 18 36 18 46 15 L46 29 C36 32 29 32 22 29 C15 26 8 26 -2 29 Z"
                  fill="url(#ballBlue)"
                />
                <path
                  d="M7 -4 C11 7 12 14 10 21 C8 28 7 35 10 48 L-5 48 L-5 -4 Z"
                  fill="url(#ballBlue)"
                />
                <path
                  d="M34 -4 C32 7 32 14 34 21 C36 28 37 35 34 48 L49 48 L49 -4 Z"
                  fill="url(#ballBlue)"
                />
                <path
                  d="M16 -4 H28 C27 5 27 10 28 14 C24 13 20 13 16 14 C17 10 17 5 16 -4 Z"
                  fill="url(#ballYellow)"
                />
                <path
                  d="M16 48 H28 C27 39 27 34 28 30 C24 31 20 31 16 30 C17 34 17 39 16 48 Z"
                  fill="url(#ballYellow)"
                />
                <path
                  d="M0 22 C9 19 15 19 22 22 C29 25 35 25 44 22"
                  fill="none"
                  stroke="rgba(255,255,255,0.34)"
                  strokeWidth="0.8"
                />
                <path
                  d="M10 -2 C14 10 14 17 12 22 C10 27 10 34 14 46"
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="0.65"
                />
                <path
                  d="M34 -2 C30 10 30 17 32 22 C34 27 34 34 30 46"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.65"
                />
              </g>
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="1.2"
              />
              <ellipse
                cx="16"
                cy="12"
                rx="9"
                ry="5"
                fill="rgba(255,255,255,0.18)"
                transform="rotate(-18 16 12)"
              />
            </svg>
          </div>
        </div>

        <div className={styles.impact} />
      </div>

      <div className={styles.credit}>Designed &amp; Developed by GOKUL</div>
    </div>
  );
}
