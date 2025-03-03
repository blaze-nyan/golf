"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  text?: string | null;
  fullScreen?: boolean;
}

const AnimatedLoading: React.FC<LoadingAnimationProps> = ({
  size = "md",
  text = null,
  fullScreen = false,
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const sizeMap = {
    sm: {
      ball: "w-4 h-4",
      splash: "w-12 h-12",
      fontSize: "text-xs",
      padding: "p-0",
    },
    md: {
      ball: "w-5 h-5",
      splash: "w-16 h-16",
      fontSize: "text-sm",
      padding: "p-0",
    },
    lg: {
      ball: "w-6 h-6",
      splash: "w-24 h-24",
      fontSize: "text-base",
      padding: "p-0",
    },
  };

  useEffect(() => {
    const masterTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
    });

    gsap.set(ballRef.current, {
      y: -40,
      opacity: 1,
      scale: 1,
    });

    gsap.set(splashRef.current, {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center",
    });

    const ballTimeline = gsap.timeline();

    ballTimeline.to(ballRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power2.in", // Accelerating drop
    });

    // Ball "sinks" slightly and fades
    ballTimeline.to(
      ballRef.current,
      {
        y: 5,
        scale: 0.8,
        opacity: 0,
        duration: 0.15,
        ease: "power1.out",
      },
      "+=0.05"
    );

    // Splash animation with better timing
    const splashTimeline = gsap.timeline();

    // Splash appears slightly before ball disappears (looks more natural)
    splashTimeline.to(
      splashRef.current,
      {
        scale: 0.3,
        opacity: 0.8,
        duration: 0.1,
        ease: "power1.out",
      },
      0.45
    ); // Synced with ball impact

    // Splash grows and fades out more realistically
    splashTimeline.to(splashRef.current, {
      scale: 1.1,
      opacity: 1,
      duration: 0.2,
      ease: "power1.out",
    });

    splashTimeline.to(splashRef.current, {
      scale: 1.3,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out", // Smoother fadeout
    });

    // Reset animation
    const resetTimeline = gsap.timeline();
    resetTimeline.set(ballRef.current, {
      y: -40,
      scale: 1,
      opacity: 1,
    });

    resetTimeline.set(splashRef.current, {
      scale: 0,
      opacity: 0,
    });

    // Add all timelines to the master timeline
    masterTimeline
      .add(ballTimeline)
      .add(splashTimeline, 0) // Start at the same time as ball
      .add(resetTimeline, 1.4); // Reset after animation completes

    // Text pulse animation if text is provided
    if (textRef.current && text) {
      gsap.to(textRef.current, {
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Clean up
    return () => {
      masterTimeline.kill();
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
    };
  }, []);

  // Dynamic colors based on theme
  const ballColor = resolvedTheme === "dark" ? "bg-[#00E676]" : "bg-[#0E793C]";
  const splashColor =
    resolvedTheme === "dark" ? "fill-[#00E676]" : "fill-[#0E793C]";
  const textColor =
    resolvedTheme === "dark" ? "text-gray-300" : "text-gray-700";

  // Container classes
  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
    : "flex flex-col items-center justify-center relative";

  return (
    <div ref={containerRef} className={containerClasses}>
      <div
        className={`relative ${sizeMap[size].padding} flex items-center justify-center`}
      >
        {/* Ball Element */}
        <div
          ref={ballRef}
          className={`${sizeMap[size].ball} ${ballColor} rounded-full shadow-md`}
        ></div>

        {/* Splash Element */}
        <div
          ref={splashRef}
          className={`absolute ${sizeMap[size].splash} flex justify-center items-center opacity-0`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={`w-full h-full ${splashColor}`}
          >
            {/* Detailed water splash path based on the SVG you provided */}
            <path
              d="M73.262,55.628c0,0.873-0.83,1.157-1.559,1.226c-1.982,0.188-3.852-1.482-5.666-0.146c-1.477,1.083-2.582,2.639-3.348,4.318
              c-0.455,0.998-1.52,4.137-0.137,4.645c1.063,0.391,3.447,0.994,5.383,1.855c1.396,0.621,3.293,1.842,1.441,3.094
              c-1.736,1.173-7.422,2.193-11.941,2.217c2.811-0.599,5.885-0.885,8.588-2c1.355-0.559,2.775-1.597,0.889-2.609
              c-1.5-0.804-4.057-1.332-4.834-1.455c0.051,0.56,0.291,1.111,0.648,1.547c0.201,0.242,0.627,0.676,1.049,1.027
              c-1.063,0.041-1.533,0.004-2.148-0.932c-0.713-1.081-1.016-2.408-1.117-3.684c-0.193-2.476,0.607-4.607,1.896-6.674
              c-1.484,0.047-2.328-0.162-3.531-0.584c-1.322-0.467-2.658-0.856-4.057-0.464c-2.119,0.597-3.651,2.826-5.356,4.068
              c-3.39,2.472-4.105-2.209-5.947-3.367c-1.231-0.774-2.353,0.261-3.58,0.698c-0.599,0.214-2.222,1.021-3.653-0.063
              c0.898,2.129,1.636,4.272,1.711,6.609c0.059,1.83-0.628,5.205-3.171,4.35c1.031-0.556,1.871-1.17,1.911-2.465
              c0.246-0.052-3.339,0.352-4.996,1.701c-1.94,1.582,2.676,2.736,3.639,2.966c4.638,1.099,9.086,1.115,14.052,1.619
              c-4.454,0.433-9.302,0.218-13.715-0.491c-1.963-0.313-4.046-0.759-5.812-1.712c-2.612-1.411-0.127-2.852,1.565-3.577
              c1.016-0.438,2.365-0.789,3.333-1.123c1.866-0.641,2.058-0.92,2.041-1.717c-0.046-2.07-2.099-7.263-5.012-8.852
              c-1.641-0.896-4.191-0.051-5.833,0.598c-1.786,0.705-4.423,1.635-6.385,1.225c-1.803-0.375-3.215-2.137-2.395-4.041
              c1.628-3.785,7.934-3.508,11.426-2.56c0.961,0.263,5.823,1.699,5.755-0.385c-0.064-1.955-3.946-1.929-4.59-3.638
              c-0.703-1.863,1.492-3.227,3.17-2.543c1.825,0.74,2.829,3.144,4.868,3.334c1.679,0.158,2.868-1.338,1.516-2.701
              c-1.308-1.319-3.644-1.793-5.087-2.918c-1.419-1.108-1.616-3.415-0.175-4.635c1.72-1.458,3.994-0.89,5.481-0.087
              c3.625,1.957,3.398,7.533,7.29,9.083c2.018,0.803,3.438-0.229,4.811-1.615c1.375-1.39,3.316-3.158,5.342-3.375
              c1.924-0.208,3.396,0.812,3.34,2.789c-0.023,0.758-0.836,2.313-0.215,2.949c0.639,0.647,1.887,0.514,2.688,0.361
              c1.945-0.366,4.541-1.641,6.506-0.924c1.018,0.371,1.277,0.998,1.174,2.015c-0.121,1.188,0.473,1.792,1.494,1.646
              c3.572-0.51,11.682-3.073,12.002,1.822c0.172,2.608-3.016,3.008-4.877,2.782c-2.25-0.272-4.656-1.258-5.66-0.79
              C72.986,54.27,73.262,55.072,73.262,55.628z"
            />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p
          ref={textRef}
          className={`mt-3 font-medium ${textColor} ${sizeMap[size].fontSize}`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default AnimatedLoading;
