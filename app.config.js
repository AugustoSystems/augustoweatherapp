module.exports = ({ config }) => {
  // Get API key directly from environment
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  
  // Log the environment variable to help with debugging
  console.log('Config check - API Key:', apiKey ? {
    exists: true,
    length: apiKey.length,
    preview: apiKey.substring(0, 4)
  } : {
    exists: false,
    message: 'API key not found in environment'
  });
  
  return {
    ...config,
    extra: {
      weatherApiKey: apiKey || null,
    },
  };
};