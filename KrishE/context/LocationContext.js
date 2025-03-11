import { useState, useEffect, createContext } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Create a context for location
export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState('');

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            const state = await Location.reverseGeocodeAsync(loc.coords);
            setState(state[0].region);
            setLoading(false);
        };
        getLocation();
    }, []);

    if (loading) return null; // Prevent rendering before location is ready

    return (
        <LocationContext.Provider value={{ location, setLocation, state }}>
            {children}
        </LocationContext.Provider>
    );
};
