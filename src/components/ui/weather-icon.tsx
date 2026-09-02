import { Lucide } from '@react-native-vector-icons/lucide';

type WeatherIconProps = {
    name: string;
    size?: number;
    color?: string;
};

export function WeatherIcon({
                                name,
                                size = 40,
                                color = '#000',
                            }: WeatherIconProps) {
    return (
        <Lucide
            name={name}
            size={size}
            color={color}
        />
    );
}