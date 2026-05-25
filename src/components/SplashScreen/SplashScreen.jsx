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
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="rgba(255,255,255,0.04)"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M22 2 Q36 13 36 22 Q36 34 22 42"
                fill="none"
                stroke="#FFD000"
                strokeWidth="2"
              />
              <path
                d="M22 2 Q8 13 8 22 Q8 34 22 42"
                fill="none"
                stroke="#4D7EFF"
                strokeWidth="1.8"
              />
              <path
                d="M2 19 Q13 16 22 22 Q31 28 42 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
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
