export async function httpClient(endpoint: string, options: RequestInit) {
  // console.log(
  //   `Requisição para: ${process.env.EXPO_PUBLIC_LOCAL_API_URL}${endpoint}`
  // );
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_LOCAL_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}
