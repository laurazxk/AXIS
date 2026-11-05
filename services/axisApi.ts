// URL configurada no arquivo .env do projeto Expo.
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export async function checkAxisBackend(): Promise<unknown> {
  if (!API_URL) {
    throw new Error("Configure EXPO_PUBLIC_API_URL no arquivo .env.");
  }

  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`Falha na conexão com o Render: HTTP ${response.status}`);
  }
  return response.json();
}