declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_WEATHER_API_KEY: string;
    }
  }
}

export {};