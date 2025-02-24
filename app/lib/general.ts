export const checkClientId = (): string | null => {
  return localStorage.getItem("clientId");
};

export const checkClientProfilePicture = () => {
  return localStorage.getItem("clientProfilePicture");
};

