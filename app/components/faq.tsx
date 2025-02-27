import { Accordion, AccordionItem } from "@heroui/react";

export default function Faq() {
  const contents = [
    {
      label: "Why can't I book a tee time without an account?",
      answer:
        "Our golf club requires all users to register before booking to ensure a seamless experience and track reservations properly. Guest or visitor bookings are not allowed for simplicity.",
    },
    {
      label: "Can I cancel or reschedule my booking?",
      answer:
        "No, cancellations, rescheduling, and refunds are not allowed once a booking is confirmed. Please make sure to check your availability before finalizing your reservation.",
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

  return (
    <>
      <h2 className="text-center text-2xl font-bold">FAQs</h2>
      <Accordion>
        {contents.map((content) => (
          <AccordionItem
            key={content.label}
            aria-label={content.label}
            title={content.label}
          >
            {content.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
