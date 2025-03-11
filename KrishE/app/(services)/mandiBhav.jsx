import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LocationContext } from '../../context/LocationContext';
import { supabase } from '../../lib/supabase';
import { translations } from '../../localizations';
import { LanguageContext } from '../../context/LanguageContext';
import DropDown2 from '../../components/DropDown2';


const mandiBhav = () => {

  const { state } = useContext(LocationContext);
  const { lang } = useContext(LanguageContext);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [marketData, setMarketData] = useState([]);
  
  const API_KEY = '579b464db66ec23bdd00000140b3ddbbedf04b60784e328c9cbfad37';
  const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&filters%5Bstate.keyword%5D=${state}&filters%5Bcommodity%5D=${selectedCrop}`;
  
  useEffect(()=>{
  const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        setMarketData(data.records);
        console.log("Location: ",state);
        console.log("Selected Crop: ",selectedCrop);
        console.log("Records: ",data.records);
        console.log("Market Data: ",marketData);
        console.log("API URL: ",API_URL);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
      finally{
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCrop, state]);
  
  return (
    <SafeAreaView className='w-full h-full bg-primary px-4'>
      <Text className='text-center text-3xl font-pbold text-white mt-24 mb-10'>{translations[lang].MandiBhav}</Text>
      <ScrollView className='w-full h-full flex-1' showsVerticalScrollIndicator={false}>
        <DropDown2 onSelect={setSelectedCrop} />
        {loading ? (
          <View className='w-full h-full justify-center items-center'>
            <Text className='font-pregular text-center text-lg text-white-text'>Loading...</Text>
          </View>
        ):(
          marketData.length > 0 ? (
            <View className='mt-5'>
              {marketData.map((item, index) => (
                <View key={index} className='w-full bg-white-text border-2 border-white-borders rounded-lg mb-4 flex-row justify-between items-center p-4'>
                  <View className='flex-1'>
                    <Text className='font-pbold text-lg text-black'>{item.market} Market</Text>
                    <Text className='font-pregular text-sm text-black'>{item.commodity}</Text>
                    <Text className='font-pregular text-sm text-black'>Date - {item.arrival_date}</Text>
                  </View>
                  <View>
                    <Text className='font-psemibold text-lg text-black'>₹{item.min_price} - ₹{item.max_price}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className='w-full h-full justify-center items-center'>
              <Text className='font-pregular text-center text-lg text-white-text'>No data available</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>

  )
}

export default mandiBhav