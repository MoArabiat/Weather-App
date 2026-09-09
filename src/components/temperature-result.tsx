// src/components/temperature-result.tsx
import { StyleSheet, Text } from 'react-native';

type TemperatureResultProps = {
    displayedTemperature: number | null;
    isFahrenheit: boolean;
};

export default function TemperatureResult({
                                              displayedTemperature,
                                              isFahrenheit,
                                          }: TemperatureResultProps) {
    if (displayedTemperature === null) {
        return null;
    }

    return (
        <Text style={styles.temperature}>
            {displayedTemperature.toFixed(1)}°{isFahrenheit ? 'F' : 'C'}
        </Text>
    );
}

const styles = StyleSheet.create({
    temperature: {
        fontSize: 64,
        fontWeight: '700',
        color: '#2563EB',
        marginVertical: 15,
    },
});