export const registerNewUser = async (email: string, password: string) => {
  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.body) {
    throw new Error("No Response Body");
  }

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
};
