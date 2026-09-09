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

import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";

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
          ? 'sun'
          : 'cloud-sun';

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
              <FontAwesomeFreeSolid
                  name={weatherIcon}
                  size={62}
                  color="black"
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
    backgroundColor: '#F4F9FF',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 35,
    color: '#1E293B',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderColor: '#D6E2F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    color: '#1E293B',
  },

  button: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    marginTop: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  weatherContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  city: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },

  country: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 6,
  },

  toggleButton: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: '#E8F1FF',
    marginTop: 10,
  },

  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
});
