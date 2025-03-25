"use client";

import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import gsap from "gsap";
import { useLanguage } from "../contexts/LanguageContext";

export default function Faq() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // Refs for animation
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // FAQ content with FLAT translation keys
  const getContents = () => [
    {
      label: t("faqAccountRequiredQuestion"),
      answer: t("faqAccountRequiredAnswer"),
    },
    {
      label: t("faqRescheduleQuestion"),
      answer: t("faqRescheduleAnswer"),
    },
    {
      label: t("faqBookingDetailsQuestion"),
      answer: t("faqBookingDetailsAnswer"),
    },
    {
      label: t("faqTeeTimeAvailabilityQuestion"),
      answer: t("faqTeeTimeAvailabilityAnswer"),
    },
    {
      label: t("faqGolfLessonsQuestion"),
      answer: t("faqGolfLessonsAnswer"),
    },
  ];

  // Handle hydration properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize animations after component mounts
  useEffect(() => {
    if (!mounted) return;

    // Set initial states
    gsap.set(titleRef.current, {
      opacity: 0,
      y: -20,
    });

    // Find all accordion items after they're rendered
    const accordionItems = document.querySelectorAll(".faq-item");

    gsap.set(accordionItems, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: accordionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
    });

    // Animate accordion items with stagger
    tl.to(
      accordionItems,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.3"
    );

    // Add click animation for accordion items
    accordionItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Small pulse animation when clicking an accordion item
        gsap.to(item, {
          scale: 0.98,
          duration: 0.1,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(item, {
              scale: 1,
              duration: 0.3,
              ease: "elastic.out(1, 0.5)",
            });
          },
        });
      });
    });

    // Cleanup function
    return () => {
      if (typeof gsap.killTweensOf === "function") {
        gsap.killTweensOf([titleRef.current, ...accordionItems]);
      }

      accordionItems.forEach((item) => {
        item.removeEventListener("click", () => {});
      });
    };
  }, [mounted]);

  // Return empty div if not mounted yet to prevent hydration mismatch
  if (!mounted) {
    return <div></div>;
  }

  const contents = getContents();

  return (
    <div ref={accordionRef}>
      <h2 ref={titleRef} className="text-center text-2xl font-bold mb-6">
        {t("faqTitle")}
      </h2>
      <Accordion className="faq-accordion">
        {contents.map((content) => (
          <AccordionItem
            key={content.label}
            aria-label={content.label}
            title={content.label}
            className="faq-item transition-all duration-300"
          >
            {content.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
