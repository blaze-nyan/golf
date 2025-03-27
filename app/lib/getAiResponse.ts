const apiKey = "AIzaSyDyzOZC03QelmCuk2yvVoEZ0IHqFNtsuSQ";
import { logger } from "@/app/lib/logger";
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
          // Thai
          { text: "input: สวัสดีครับ" },
          { text: "output: สวัสดีครับ! มีอะไรให้ช่วยเกี่ยวกับกอล์ฟไหมครับ?" },
          { text: "input: คุณเป็นใคร?" },
          {
            text: "output: ผมเป็นบอทผู้ช่วยกอล์ฟครับ ยินดีให้บริการข้อมูลเกี่ยวกับสนามกอล์ฟและการจองเวลาออกรอบครับ",
          },
          { text: "input: จองกอล์ฟยังไง?" },
          {
            text: "output: คุณสามารถไปที่ https://ta-golf.netlify.app/auth/login เพื่อเข้าสู่ระบบ และไปที่ https://ta-golf.netlify.app/golfcourse เพื่อทำการจองครับ!",
          },

          // English
          { text: "input: Hello" },
          { text: "output: Hello! How can I help you with golf today?" },
          { text: "input: Who are you?" },
          {
            text: "output: I am a Golf Assistant chatbot. I can help you with information about our golf courses and booking tee times.",
          },
          { text: "input: How to book the golf?" },
          {
            text: "output: You can go to https://ta-golf.netlify.app/auth/login to log in, then go to https://ta-golf.netlify.app/golfcourse to make your booking!",
          },

          // Japanese
          { text: "input: こんにちは" },
          {
            text: "output: こんにちは！ゴルフに関して何かお手伝いできることはありますか？",
          },
          { text: "input: あなたは誰ですか？" },
          {
            text: "output: 私はゴルフアシスタントチャットボットです。ゴルフコースの情報や予約についてサポートいたします。",
          },
          { text: "input: ゴルフの予約方法は？" },
          {
            text: "output: https://ta-golf.netlify.app/auth/login でログインし、https://ta-golf.netlify.app/golfcourse で予約ができます！",
          },

          // Korean
          { text: "input: 안녕하세요" },
          {
            text: "output: 안녕하세요! 골프와 관련하여 어떤 도움이 필요하신가요?",
          },
          { text: "input: 당신은 누구인가요?" },
          {
            text: "output: 저는 골프 어시스턴트 챗봇입니다. 골프 코스 정보와 티타임 예약을 도와드릴 수 있습니다.",
          },
          { text: "input: 골프 예약은 어떻게 하나요?" },
          {
            text: "output: https://ta-golf.netlify.app/auth/login 에서 로그인한 후 https://ta-golf.netlify.app/golfcourse 에서 예약하실 수 있습니다!",
          },

          // Indonesian
          { text: "input: Halo" },
          {
            text: "output: Halo! Ada yang bisa saya bantu terkait golf hari ini?",
          },
          { text: "input: Anda siapa?" },
          {
            text: "output: Saya adalah chatbot Asisten Golf. Saya dapat membantu Anda dengan informasi tentang lapangan golf kami dan pemesanan waktu tee.",
          },
          { text: "input: Bagaimana cara memesan golf?" },
          {
            text: "output: Anda dapat pergi ke https://ta-golf.netlify.app/auth/login untuk masuk, kemudian pergi ke https://ta-golf.netlify.app/golfcourse untuk melakukan pemesanan Anda!",
          },

          // Chinese
          { text: "input: 你好" },
          { text: "output: 你好！今天有什么高尔夫相关的问题需要帮助吗？" },
          { text: "input: 你是谁？" },
          {
            text: "output: 我是高尔夫助手聊天机器人。我可以为您提供关于我们高尔夫球场的信息和预订开球时间。",
          },
          { text: "input: 如何预订高尔夫？" },
          {
            text: "output: 您可以前往 https://ta-golf.netlify.app/auth/login 登录，然后前往 https://ta-golf.netlify.app/golfcourse 进行预订！",
          },

          // Keeping your original feature descriptions in multiple languages
          { text: "input: Sendible features & plans" },
          {
            text: `output: Splash Golf Club offers an intuitive online booking platform designed for a seamless golf experience. Our features include:
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

                            Plan your week ahead with our **detailed weather forecast**, ensuring optimal playing conditions.`,
          },
          { text: "input: I'm already a customer" },
          {
            text: `output: Thank you for being a valued member of **Splash Golf Club**! Here's how you can manage your experience:
      
                          🔹 **View Your Booking Details:** Log into your account and check your upcoming tee times and reservations.  
                          🔹 **Modify or Cancel a Booking:** Navigate to the "My Bookings" section to adjust your schedule.  
                          🔹 **Enjoy Exclusive Benefits:** As a member, you get access to priority booking, exclusive events, and special discounts.  
        `,
          },
          { text: "input: Request a demo" },
          {
            text: `output: Interested in a demo? We'd love to show you how **Splash Golf Club's online booking system** works!
      
                  📅 **Schedule a live demo:** Book a one-on-one walkthrough with our team to explore our intuitive platform, membership benefits, and golf course features.  
                  🎥 **Watch a demo video:** Learn how to book tee times, manage reservations, and access exclusive member perks.  
                  📧 **Contact us:** Have specific questions? Reach out to our team for a personalized consultation.

                  ➡️ **[Schedule a Demo](#)** | 🎥 **[Watch Demo Video](#)** | 📩 **[Contact Us](#)**`,
          },
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
    if (!response.ok) {
      logger.error(`API error: ${response.status} ${response.statusText}`);
      return [
        {
          type: "error",
          text: `Error ${response.status}: ${response.statusText}`,
        },
      ];
    }
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
    logger.error("Error fetching AI response:", error);
    return [{ type: "text", text: "There was an error with the request." }];
  }
}
