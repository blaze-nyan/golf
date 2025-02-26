export const checkClientId = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("clientId");
  }
  return null;
};

export const checkClientProfilePicture = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("clientProfilePicture");
  }
  return null;
};

export const usePlaceholderGolfCourseImageLink = () => {
  return "https://media.istockphoto.com/id/176834848/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%97%E0%B8%B5%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%9A%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94.jpg?s=1024x1024&w=is&k=20&c=gDNRJfz9zoIpb2VkGUTJ7bSnXGKk7AgNHLVBf1kAT8E=";
};
