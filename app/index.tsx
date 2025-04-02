import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Droplets, Compass, Clock } from 'lucide-react-native';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

type WeatherData = {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    sunrise: number;
    sunset: number;
  };
  visibility: number;
};

const getWeatherBackground = (condition: string) => {
  const backgrounds: Record<string, string> = {
    Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2',
    Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda',
    Rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
    Snow: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28',
    Fog: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba',
  };

  return backgrounds[condition] || backgrounds.Clear;
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  const iconProps = { size: 48, color: '#fff' };
  
  switch (condition) {
    case 'Clear':
      return <Sun {...iconProps} />;
    case 'Clouds':
      return <Cloud {...iconProps} />;
    case 'Rain':
    case 'Drizzle':
      return <CloudRain {...iconProps} />;
    case 'Snow':
      return <CloudSnow {...iconProps} />;
    case 'Thunderstorm':
      return <CloudLightning {...iconProps} />;
    case 'Fog':
    case 'Mist':
    case 'Haze':
      return <CloudFog {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export default function WeatherApp() {
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
      }
    } catch (err) {
      console.log('Error getting location:', err);
    }
  };

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const fetchWeatherByZip = async () => {
    try {
      setLoading(true);
      setError('');

      if (!validateZipCode(zipCode)) {
        setError('Please enter a valid 5-digit zip code');
        setLoading(false);
        return;
      }
      
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        const errorData = await geoResponse.json();
        throw new Error(errorData.message || 'Invalid zip code or API error');
      }

      const geoData = await geoResponse.json();
      
      if (!geoData.lat || !geoData.lon) {
        throw new Error('Location not found for this zip code');
      }

      await fetchWeatherByCoords(geoData.lat, geoData.lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching weather data');
      setWeatherData(null);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!zipCode.trim()) {
      setError('Please enter a zip code');
      return;
    }
    fetchWeatherByZip();
  };

  const backgroundImage = weatherData
    ? getWeatherBackground(weatherData.weather[0].main)
    : getWeatherBackground('Clear');

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.container}
      imageStyle={{ opacity: 0.7 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.header}>
              Enter your Name and Zipcode - to get the current weather
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="What is your name?"
                placeholderTextColor="#fff"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your zip code"
                placeholderTextColor="#fff"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                maxLength={5}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Get Weather</Text>
                )}
              </TouchableOpacity>
            </View>

            {weatherData && (
              <View style={styles.weatherContainer}>
                <Text style={styles.welcomeText}>
                  Welcome, {name}! Here's your weather in {weatherData.name}:
                </Text>
                <WeatherIcon condition={weatherData.weather[0].main} />
                <Text style={styles.temperature}>
                  {Math.round(weatherData.main.temp)}°F
                </Text>
                <Text style={styles.condition}>
                  {weatherData.weather[0].description}
                </Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Feels Like</Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weatherData.main.feels_like)}°F
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <View style={styles.detailRow}>
                      <Droplets size={16} color="#fff" />
                      <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Wind</Text>
                    <View style={styles.detailRow}>
                      <Wind size={16} color="#fff" />
                      <Text style={styles.detailValue}>
                        {Math.round(weatherData.wind.speed)} mph
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Direction</Text>
                    <View style={styles.detailRow}>
                      <Compass size={16} color="#fff" />
                      <Text style={styles.detailValue}>
                        {getWindDirection(weatherData.wind.deg)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Visibility</Text>
                    <Text style={styles.detailValue}>
                      {(weatherData.visibility / 1609.34).toFixed(1)} mi
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Pressure</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.main.pressure} hPa
                    </Text>
                  </View>
                </View>

                <View style={styles.sunTimes}>
                  <View style={styles.sunTimeItem}>
                    <Clock size={16} color="#fff" />
                    <Text style={styles.sunTimeLabel}>Sunrise</Text>
                    <Text style={styles.sunTimeValue}>
                      {formatTime(weatherData.sys.sunrise)}
                    </Text>
                  </View>
                  <View style={styles.sunTimeItem}>
                    <Clock size={16} color="#fff" />
                    <Text style={styles.sunTimeLabel}>Sunset</Text>
                    <Text style={styles.sunTimeValue}>
                      {formatTime(weatherData.sys.sunset)}
                    </Text>
                  </View>
                </View>

                <View style={styles.tempRange}>
                  <Text style={styles.tempRangeText}>
                    High: {Math.round(weatherData.main.temp_max)}°F
                  </Text>
                  <Text style={styles.tempRangeText}>
                    Low: {Math.round(weatherData.main.temp_min)}°F
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
  },
  weatherContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 15,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  temperature: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  condition: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  detailItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  sunTimeItem: {
    alignItems: 'center',
  },
  sunTimeLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  sunTimeValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tempRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  tempRangeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});