var apiKey = "AIzaSyDyzOZC03QelmCuk2yvVoEZ0IHqFNtsuSQ";
interface ResponseData {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export default async function getAiResponse(event: string): Promise<{ type: string; text: string }[]> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  var userMessage = event;

  var requestBody = {
    "contents": [
      {
        "role": "user",
        "parts": [
          { text: "input: Who are you?" },
          { text: `output: I am a Golf Assistant chatbot.` },
          { text: "input: How to book the golf?" },
          { text: `output: You can go to the to login and go to the booking to book golf  https://ta-golf.netlify.app/auth/login` },
          { text: `input: ${userMessage}` },
          { text: "output" }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.9,
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": 12000,
      "stopSequences": []
    }
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  };

  try {
    const response = await fetch(apiUrl, options);  // Use await for fetch to resolve properly
    const responseData: ResponseData = await response.json();  // Parse the response with type annotation

    // Check if candidates exist and are not empty
    if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content?.parts?.length > 0) {
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
