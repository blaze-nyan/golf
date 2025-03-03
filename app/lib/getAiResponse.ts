const apiKey = "AIzaSyDyzOZC03QelmCuk2yvVoEZ0IHqFNtsuSQ";
interface ResponseData {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export default async function getAiResponse(
  event: string
): Promise<{ type: string; text: string }[]> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const userMessage = event;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          { text: "input: Who are you?" },
          { text: `output: I am a Golf Assistant chatbot.` },
          { text: "input: How to book the golf?" },
          {
            text: `output: You can go to the to login and go to the booking to book golf  https://ta-golf.netlify.app/auth/login! Afterwards you can just go booking at https://ta-golf.netlify.app/golfcourse!`,
          },
          { text: "input: Sendible features & plans" },
          { text: `output: Splash Golf Club offers an intuitive online booking platform designed for a seamless golf experience. Our features include:
                             **Real-time tee time availability** for easy scheduling.
                             **Secure member access** to manage your reservations.
                             **Hassle-free booking process**, letting you focus on your game.
                            
                            Membership Plans:
                             **Basic**: Standard course access, member discounts, basic facilities.
                             **Premium**: Priority booking, exclusive event access, guest passes.
                             **VIP**: Unlimited access, private locker, personal golf instructor.
                            
                            Explore our beautiful golf courses:
                             **The Highland Links**: Scenic mountain course (18 holes, Par 72).
                             **Hackathon Golf Course**: Championship course with lush greens.
                             **Sunset Bay Golf Club**: Coastal course with breathtaking views.

                            Plan your week ahead with our **detailed weather forecast**, ensuring optimal playing conditions.` },
          { text: "input: I'm already a customer" },
          { text: `output: Thank you for being a valued member of **Splash Golf Club**! Here’s how you can manage your experience:
      
                          🔹 **View Your Booking Details:** Log into your account and check your upcoming tee times and reservations.  
                          🔹 **Modify or Cancel a Booking:** Navigate to the "My Bookings" section to adjust your schedule.  
                          🔹 **Enjoy Exclusive Benefits:** As a member, you get access to priority booking, exclusive events, and special discounts.  
        ` },
          { text: "input: Request a demo" },
          { text: `output: Interested in a demo? We'd love to show you how **Splash Golf Club's online booking system** works!
      
                  📅 **Schedule a live demo:** Book a one-on-one walkthrough with our team to explore our intuitive platform, membership benefits, and golf course features.  
                  🎥 **Watch a demo video:** Learn how to book tee times, manage reservations, and access exclusive member perks.  
                  📧 **Contact us:** Have specific questions? Reach out to our team for a personalized consultation.

                  ➡️ **[Schedule a Demo](#)** | 🎥 **[Watch Demo Video](#)** | 📩 **[Contact Us](#)**` },
          { text: `input: ${userMessage}` },
          { text: "output" },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 12000,
      stopSequences: [],
    },
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(apiUrl, options); // Use await for fetch to resolve properly
    const responseData: ResponseData = await response.json(); // Parse the response with type annotation

    // Check if candidates exist and are not empty
    if (
      responseData.candidates &&
      responseData.candidates.length > 0 &&
      responseData.candidates[0].content?.parts?.length > 0
    ) {
      const textResult = responseData.candidates[0].content.parts[0].text;
      const mess = [{ type: "text", text: textResult.toString() }];
      return mess;
    } else {
      // Handle case when candidates array is empty or not present
      return [{ type: "text", text: "No response available from AI." }];
    }
  } catch (error) {
    // Handle errors such as failed API requests
    console.error("Error fetching AI response:", error);
    return [{ type: "text", text: "There was an error with the request." }];
  }
}
