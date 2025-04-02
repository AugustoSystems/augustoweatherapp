# Weather App

A beautiful and responsive weather application built with Expo and React Native, providing real-time weather information with a stunning user interface.

![Weather App Screenshot](https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=600&fit=crop)

## Features

- 📍 **Location-based Weather**: Automatically fetches weather for your current location
- 🔍 **ZIP Code Search**: Look up weather information for any US ZIP code
- 🌡️ **Comprehensive Weather Data**:
  - Current temperature and conditions
  - "Feels like" temperature
  - Humidity levels
  - Wind speed and direction
  - Visibility
  - Atmospheric pressure
  - Sunrise and sunset times
  - Daily temperature range (high/low)
- 🎨 **Dynamic Backgrounds**: Background images change based on current weather conditions
- 📱 **Responsive Design**: Works seamlessly across web, iOS, and Android platforms
- 🔄 **Real-time Updates**: Fresh weather data from OpenWeather API

## Technology Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 52.0.30)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (v4.0.17)
- **UI Components**: React Native core components
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Location Services**: expo-location
- **Weather Data**: [OpenWeather API](https://openweathermap.org/api)
- **Type Safety**: TypeScript
- **State Management**: React Hooks

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- OpenWeather API key

## Environment Setup

1. Create a `.env` file in the root directory:
```
EXPO_PUBLIC_WEATHER_API_KEY=your_openweather_api_key_here
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Running the App

- **Web**: Opens automatically in your default browser
- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app

## Project Structure

```
weather-app/
├── app/                    # Application routes
│   ├── _layout.tsx        # Root layout configuration
│   ├── +not-found.tsx     # 404 page
│   └── index.tsx          # Main weather screen
├── assets/                # Static assets
│   └── images/
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── package.json          # Project dependencies
```

## Key Features Implementation

### Location Services

The app uses `expo-location` to:
- Request user permission for location access
- Get current coordinates
- Reverse geocode coordinates to location names

### Weather Data Fetching

Weather information is fetched from OpenWeather API using:
- Current weather endpoint for real-time conditions
- Geocoding API for ZIP code lookups

### Dynamic Backgrounds

Background images change based on weather conditions:
- Clear skies
- Cloudy
- Rain
- Snow
- Thunderstorm
- Fog

### Error Handling

Comprehensive error handling for:
- Invalid ZIP codes
- API failures
- Location permission denials
- Network issues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Background images from [Unsplash](https://unsplash.com/)
- Icons by [Lucide](https://lucide.dev/)