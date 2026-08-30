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

      const locationUrl =
        'https://geocoding-api.open-meteo.com/v1/search' +
        '?name=' +
        cityName +
        '&count=10' +
        '&language=en' +
        '&format=json';

      const locationResponse = await fetch(locationUrl);

      if (!locationResponse.ok) {
        throw new Error('Could not search for the city.');
      }

      const locationData = await locationResponse.json();

      // No results at all
      if (
        !locationData.results ||
        locationData.results.length === 0
      ) {
        Alert.alert(
          'City not found',
          'The city you entered does not exist. Please check the city name and try again.'
        );

        return;
      }

      // The exact city the user typed
      const searchedCity = city.trim().toLowerCase();

      const location = locationData.results.find(
          (result: any) => {
            if (!result.name || !result.feature_code) {
              return false;
            }

            const resultName =
                result.name.trim().toLowerCase();

            const featureCode =
                result.feature_code;

            const isPopulatedPlace =
                featureCode === 'PPL' ||
                featureCode === 'PPLA' ||
                featureCode === 'PPLA2' ||
                featureCode === 'PPLA3' ||
                featureCode === 'PPLA4' ||
                featureCode === 'PPLC';

            const nameMatches =
                resultName === searchedCity;

            const hasPopulation =
                typeof result.population === 'number' &&
                result.population > 0;

            return (
                isPopulatedPlace &&
                nameMatches &&
                hasPopulation
            );
          }
      );

      if (!location) {
        Alert.alert(
            'City not found',
            `"${city.trim()}" is not a valid city. Please enter a real city name.`
        );

        return;
      }

      // Save the country
      setCountry(location.country);

      // Get weather for the city
      const weatherUrl =
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=' +
        location.latitude +
        '&longitude=' +
        location.longitude +
        '&current=temperature_2m';

      const weatherResponse =
        await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error(
          'Could not get the weather.'
        );
      }

      const weatherData =
        await weatherResponse.json();

      if (
        !weatherData.current ||
        typeof weatherData.current
          .temperature_2m !== 'number'
      ) {
        throw new Error(
          'Temperature data is unavailable.'
        );
      }

      setTemperature(
        weatherData.current.temperature_2m
      );
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

              <Text style={styles.city}>
                {city}
              </Text>

              <Text style={styles.country}>
                {country}
              </Text>

              <Text style={styles.temperature}>
                {displayedTemperature.toFixed(1)}°
                {isFahrenheit ? 'F' : 'C'}
              </Text>

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

  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
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
