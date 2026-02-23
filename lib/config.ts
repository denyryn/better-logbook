import { ScrollText } from "lucide-react";

export const config = {
  app: {
    name: "Better Logbook",
    description: "Better Logbook",
    url: "https://better-logbook.vercel.app",
    icon: ScrollText,
    logo: "/next.svg",
    home: "/",
  },
  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_API_BASE_URL,
      model: "deepseek-chat",
    },
    googleai: {
      apiKey: process.env.GOOGLEAI_API_KEY,
    },
  },
};
