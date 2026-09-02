import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {geocodeCity, GeocodedCity, getCurrentTemperatureCelsius} from "@/services/weather-api";
import TemperatureResult from '@/components/temperature-result';
import Ionicons from '@react-native-vector-icons/ionicons';
export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (city.trim() === '') {
      Keyboard.dismiss();

      Alert.alert(
        'Missing city',
        'Please enter a city.'
      );

      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Search for the city
      const cityName = encodeURIComponent(city.trim());
      const cityData: GeocodedCity = await geocodeCity(cityName);

      // Save the country
      setCountry(cityData.country);
      const temperature = await getCurrentTemperatureCelsius(cityData.latitude, cityData.longitude);

      setTemperature(temperature);
    } catch (error) {
      console.log(
        'Weather error:',
        error
      );

      Alert.alert(
        'Error',
        'Something went wrong while getting the weather.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert Celsius to Fahrenheit
  const displayedTemperature =
    temperature === null
      ? null
      : isFahrenheit
        ? (temperature * 9) / 5 + 32
        : temperature;

  const weatherIcon =
      temperature !== null && temperature > 20
          ? 'sunny-outline'
          : 'cloud-outline';

  const weatherContent = (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          Weather App
        </Text>

        <Text style={styles.label}>
          Enter the city
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={(text) => {
            setCity(text);

            // Clear the previous result
            // when the user starts typing
            if (temperature !== null) {
              setTemperature(null);
              setCountry('');
            }
          }}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={getWeather}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Loading...'
              : 'Get Weather'}
          </Text>
        </TouchableOpacity>

        {temperature !== null &&
          displayedTemperature !== null && (
            <View style={styles.weatherContainer}>
              <Ionicons
                  name={weatherIcon}
                  size={70}
                  color="orange"
              />

              <Text style={styles.city}>
                {city}
              </Text>

              <Text style={styles.country}>
                {country}
              </Text>

              <TemperatureResult displayedTemperature={displayedTemperature} isFahrenheit={isFahrenheit} />

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => {
                  Keyboard.dismiss();
                  setIsFahrenheit(
                    !isFahrenheit
                  );
                }}
              >
                <Text style={styles.toggleText}>
                  {isFahrenheit
                    ? 'Show in °C'
                    : 'Show in °F'}
                </Text>
              </TouchableOpacity>

            </View>
          )}

      </View>
    </SafeAreaView>
  );

  // Web
  if (Platform.OS === 'web') {
    return weatherContent;
  }

  // Mobile
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      {weatherContent}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },

  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  weatherContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  city: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  country: {
    fontSize: 18,
    color: '#666666',
    marginTop: 5,
  },

  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
  },

  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
