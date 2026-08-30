import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Missing city', 'Please enter a city.');
      return;
    }

    try {
      setLoading(true);

      // Find the city
      const locationResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              city
          )}&count=1`
      );

      const locationData = await locationResponse.json();

      if (!locationData.results || locationData.results.length === 0) {
        Alert.alert('City not found', 'Please check the city name.');
        return;
      }

      const location = locationData.results[0];

      // Get the weather
      const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m`
      );

      const weatherData = await weatherResponse.json();

      setTemperature(weatherData.current.temperature_2m);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while getting the weather.');
    } finally {
      setLoading(false);
    }
  };

  const displayedTemperature =
      temperature === null
          ? null
          : isFahrenheit
              ? (temperature * 9) / 5 + 32
              : temperature;

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Weather App</Text>

          <TextInput
              style={styles.input}
              placeholder="Enter country"
              value={country}
              onChangeText={setCountry}
          />

          <TextInput
              style={styles.input}
              placeholder="Enter city"
              value={city}
              onChangeText={setCity}
          />

          <TouchableOpacity
              style={styles.button}
              onPress={getWeather}
              disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Get Weather'}
            </Text>
          </TouchableOpacity>

          {displayedTemperature !== null && (
              <View style={styles.weatherContainer}>
                <Text style={styles.temperature}>
                  {displayedTemperature.toFixed(1)}°
                  {isFahrenheit ? 'F' : 'C'}
                </Text>

                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsFahrenheit(!isFahrenheit)}
                >
                  <Text style={styles.toggleText}>
                    Show in °{isFahrenheit ? 'C' : 'F'}
                  </Text>
                </TouchableOpacity>
              </View>
          )}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#333',
    marginBottom: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  weatherContainer: {
    alignItems: 'center',
  },

  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#eee',
  },

  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});