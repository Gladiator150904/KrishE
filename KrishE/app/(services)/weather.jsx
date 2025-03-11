import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { LocationContext } from '../../context/LocationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { translations } from '../../localizations';
import { LanguageContext } from '../../context/LanguageContext';
import { backgrounds } from '../../constants/weather_bg';
import { LinearGradient } from 'expo-linear-gradient';
// import { weatherIcons } from '../../constants/weather_icons';
import PlantEffect from '../../components/PlantEffect';
import { icons } from '../../constants';

const Weather = () => {
  const { location } = useContext(LocationContext);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState('day');

  

  const apiKey = '8d232182e91e415883872025252901';
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location.latitude},${location.longitude}&aqi=no&days=5`;

  const fetchWeatherData = async () => {
    if (!location) return;

    const hour = new Date().getHours();
    if( hour >= 6 && hour <= 18 ) {
      setTime('day');
    } else {
      setTime('night');
    }
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
    fetchWeatherData();
  }, [location]);

  return (
    <SafeAreaView className="h-full bg-black justify-center items-center">
      {loading ? (
        <Text className="text-white-text text-lg">Loading...</Text>
      ) : weather ? (
        <View className="w-full h-full items-center" >
          <ImageBackground
            source={backgrounds[time][weather.current.condition.text]}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.8)', 'transparent']}
            start={{ x: 0, y: 1 }}
            via={{x: 0, y: 0.2}}
            end={{ x: 0, y: 0 }}
            className="w-full h-full rounded-xl absolute ml-5"
          >
            {/* Main Weather Information */}
            <View className="mt-10 ml-8 pt-5 flex-row justify-between items-center">
              <View>
                <Text className={`${time === 'night'?'text-white-text':'text-black'} font-pregular text-5xl pt-3`}>
                  {weather.current.condition.text}
                </Text>
                <Text className={`${time === 'night'?'text-white-text':'text-black'} font-psemibold text-3xl mb-5`}>
                  {weather.current.temp_c}℃
                </Text>
                <Text className='font-pregular text-lg text-white-text'>
                  {weather.location.name}, {weather.location.country}
                </Text>
              </View>
              <Image source={{uri: `https:${weather.current.condition.icon}`}} className="w-20 h-20 mr-10"/>
            </View>

            <TouchableOpacity activeOpacity={0.5} className={`px-8 ${time === 'night'?'text-white-text':'text-black'} w-36 justify-center`} onPress={fetchWeatherData}>
              <Text className={`${time === 'night'?'text-white-text':'text-black'}`}>
                Refresh
                <Image source={icons.refresh} className="w-4 h-4" resizeMode="contain" tintColor={`${time === 'night'? 'white' : 'black'}`}/>
              </Text>
            </TouchableOpacity>

            {/* Weather Details Grid */}
            <View className="mt-5 mx-5 flex-wrap gap-1">
              <View className='flex-row gap-1'>
                {/* Humidity */}
                <View className="w-1/2 p-4 bg-black/50 bg-opacity-50 rounded-tl-xl">
                  <Text className="text-white-text text-lg">Humidity</Text>
                  <Text className="text-white-text text-2xl font-bold">
                    {weather.current.humidity}%
                  </Text>
                </View>

                {/* Wind Speed */}
                <View className="w-1/2 p-4 bg-black/50 bg-opacity-50 rounded-tr-xl">
                  <Text className="text-white-text text-lg">Wind Speed</Text>
                  <Text className="text-white-text text-2xl font-bold">
                    {weather.current.wind_kph} km/h
                  </Text>
                </View>
              </View>

              <View className='flex-row gap-1'>
                {/* UV Index */}
                <View className="w-1/2 p-4 bg-black/50 bg-opacity-50 rounded-bl-xl">
                  <Text className="text-white-text text-lg">UV Index</Text>
                  <Text className="text-white-text text-2xl font-bold">
                    {weather.current.uv}
                  </Text>
                </View>

                {/* Pressure */}
                <View className="w-1/2 p-4 bg-black/50 bg-opacity-50 rounded-br-xl">
                  <Text className="text-white-text text-lg">Pressure</Text>
                  <Text className="text-white-text text-2xl font-bold">
                    {weather.current.pressure_mb} mb
                  </Text>
                </View>
              </View>
            </View>
            {/* <PlantEffect/> */}
            <FlatList
              className='rounded-xl mt-8 border-2 border-gray-500 mx-4 mb-32'
              data={weather.forecast.forecastday}
              renderItem={({ item }) => (
                <View className=" px-5 pt-5 bg-gray-300">
                  <View className='flex-row justify-between items-center'>
                    <View className='justify-between'>
                      <Text className="text-black text-lg">
                        {item.date}
                      </Text>
                      <Text className="text-black text-2xl font-bold">
                        {item.day.avgtemp_c}°C
                      </Text>
                    </View>
                    <Image source={{uri: `https:${item.day.condition.icon}`}} className='h-16 w-16' />
                  </View>
                  <View className='h-0.5 mx-2 mt-4 bg-gray-400'></View>
                </View>
              )}
              keyExtractor={(item) => item.date}
              
            />
          </LinearGradient>
        </View>
      ) : (
        <Text className="text-red-500">Failed to load weather data</Text>
      )}
    </SafeAreaView>
  );
};

export default Weather;
