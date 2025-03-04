import UserProfile from "./component/userProfile";
import { getClientInfo_ } from "@/app/lib/api";
import { decryptData } from "@/app/lib/dataEncrypt";

type Params = {  
  params: {
    clientId: string; 
  }
}

type ProfileData = { 
  "Client ID": number;
  Title: string;
  "First Name": string;
  Surname: string;
  "Given Name": string;
  Company: string;
  Gender: string;
  "Communication List": Array<any>;
}

export async function generateMetadata({ params }: Params) {
  try {
    if (!params?.clientId) {
      console.error("Missing clientId in params.");
      return {
        title: "Profile Not Found",
        description: "Client profile could not be retrieved.",
      };
    }

    const decodedClientId = decodeURIComponent(params.clientId);
    const decryptedClientId = decryptData(decodedClientId);

    if (!decryptedClientId) {
      throw new Error("Decryption failed: clientId is invalid");
    }

    // Ensure the function is awaited properly
    console.log("supterUserId",decryptedClientId)
    const [profileData] = await Promise.all([
              getClientInfo_(decryptedClientId),
                ]);
    console.log("Super Profile Data:", profileData);

    if (!profileData) {
      return {
        title: "User Profile",
        description: "Profile not found.",
      };
    }
    const name=` ${profileData["Given Name"]} ${profileData["Surname"]} `;
    return {
      title: name,
      description: `This is the page of ${name}`,
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Error Loading Profile",
      description: "There was an error loading the profile information.",
    };
  }
}

export default function Page({ params: { clientId } }: Params) { 
  return <UserProfile userId={clientId} />;
}
