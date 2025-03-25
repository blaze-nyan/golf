"use client";

import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import gsap from "gsap";

export default function Faq() {
  const [mounted, setMounted] = useState(false);

  // Refs for animation
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  // const accordionItemRefs = useRef<(HTMLElement | null)[]>([]);

  // FAQ content
  const contents = [
    {
      label: "Why can't I book a tee time without an account?",
      answer:
        "Our golf club requires all users to register before booking to ensure a seamless experience and track reservations properly. Guest or visitor bookings are not allowed for simplicity.",
    },
    {
      label: "Can I reschedule my booking?",
      answer:
        "No rescheduling, and refunds are not allowed once a booking is confirmed. Please make sure to check your availability before finalizing your reservation.",
    },
    {
      label: "Where can I find my booking details?",
      answer:
        "You can find all your booking details by clicking on the 'Profile' button, going to your Account, and scrolling down to the 'Bookings' section. This will display all your past and upcoming reservations.",
    },
    {
      label: "How can I know if my desired tee time is available?",
      answer:
        "You can check available tee times by navigating to the 'Book Tee Time' section. If a tee time is already booked by another user, it will be locked and unavailable for selection. Only available slots will be shown for booking.",
    },
    {
      label: "Can I book golf lessons or instructors through the website?",
      answer:
        "No, our website does not offer online booking for golf lessons or instructors. However, when you arrive at the golf course, you can check in at the reception counter, where you may be able to arrange for an instructor based on availability.",
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

  return (
    <div ref={accordionRef}>
      <h2 ref={titleRef} className="text-center text-2xl font-bold mb-6">
        FAQs
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
