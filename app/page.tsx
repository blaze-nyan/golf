"use client";

import { JSX, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import Faq from "./components/faq";
import Hero from "./components/hero";
import CardReview from "@/app/components/card-review";
//tour
import { createHomeTour } from "@/app/lib/advance-tour-service";
interface User {
  name: string;
  avatar: string;
}

interface ReviewProps {
  content: string;
  createdAt: string;
  rating: number;
  title: string;
  user: User;
}

export default function Home(): JSX.Element {
  // State for theme/hydration
  const [mounted, setMounted] = useState(false);

  // Refs for animation targets
  const heroRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLHeadingElement>(null);
  const reviewCardsRef = useRef<HTMLDivElement[]>([]);
  const { theme, resolvedTheme } = useTheme();

  // Reviews data
  const reviews: ReviewProps[] = [
    {
      content:
        "Arcu dui vivamus arcu felis bibendum. Amet tellus cras adipiscing enim eu turpis egestas pretium.",
      createdAt: "2021-08-01T12:00:00.000Z",
      rating: 5,
      title: "Great product",
      user: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
      },
    },
    {
      content:
        "Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus molestie nunc.",
      createdAt: "2021-09-15T14:30:00.000Z",
      rating: 4,
      title: "Very helpful service",
      user: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702c",
      },
    },
    {
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      createdAt: "2021-10-22T09:15:00.000Z",
      rating: 5,
      title: "Excellent experience",
      user: {
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026703c",
      },
    },
  ];

  // Handle hydration properly
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;

    // Start the tour
    const tour = createHomeTour();
    if (tour) {
      // Short delay to ensure the DOM is fully loaded
      const tourTimeout = setTimeout(() => {
        tour.drive();
      }, 500);

      return () => clearTimeout(tourTimeout);
    }
  }, [mounted]);
  useEffect(() => {
    if (!mounted) return;

    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initial page load animation
    const tl = gsap.timeline();

    // Hero section entrance animation
    if (heroRef.current) {
      tl.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });
    }

    // FAQ section animation
    if (faqRef.current) {
      gsap.from(faqRef.current, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // Reviews section header animation
    if (reviewsRef.current) {
      gsap.from(reviewsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }

    // Review cards animation (staggered)
    if (reviewCardsRef.current.length > 0) {
      gsap.from(reviewCardsRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    // Handle resize events to refresh animations
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [mounted]);

  // Update animations when theme changes
  useEffect(() => {
    if (!mounted) return;

    // Short delay to let theme changes complete
    const themeChangeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(themeChangeTimeout);
  }, [theme, resolvedTheme, mounted]);

  // Add a review card to the refs array
  const addToReviewRefs = (el: HTMLDivElement | null) => {
    if (el && !reviewCardsRef.current.includes(el)) {
      reviewCardsRef.current.push(el);
    }
  };

  // Return empty div if not mounted yet to prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  return (
    <div className="relative flex w-full flex-col justify-center items-center bg-background  pb-10 overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <div ref={heroRef}>
        <Hero />
      </div>

      {/* FAQ Section */}
      <div
        ref={faqRef}
        className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16 transition-all duration-300"
      >
        <Faq />
      </div>

      {/* Reviews Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16 transition-all duration-300">
        <h2
          ref={reviewsRef}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-gray-100 transition-colors duration-300"
        >
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Multiple review cards with staggered animation */}
          {reviews.map((review, index) => (
            <div
              key={index}
              ref={addToReviewRefs}
              className={`transition-transform duration-300 hover:-translate-y-2 hover:scale-102 ${
                index === 2 && reviews.length === 3
                  ? "sm:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <CardReview
                content={review.content}
                createdAt={review.createdAt}
                rating={review.rating}
                title={review.title}
                user={review.user}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
