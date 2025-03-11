import { View, Text, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import Services from '../../components/Services'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import { LoginContext } from '../../context/LoginContext'
import { supabase } from '../../lib/supabase'

const home = () => {

  const { lang } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchProfile = async () => {
      try{
        const {data, error} = await supabase.auth.getSession();
        if(error) throw error;

        const {data: profileData, error: profileError} = await supabase.from('farmer_data').select('name').eq('id', data.session.user.id).single();

        if(profileError) throw profileError;
        setName(profileData?.name || '');
        setLoading(false);
      }
      catch(error){
        setError(error.message);
        setLoading(false);
      }
    }

    fetchProfile();
  }, [])

  return (
    <SafeAreaView className='bg-primary px-4 '>
      <ScrollView contentContainerStyle = {{
        height:'100%'
      }}>
        <View className='flex-row items-center  mt-10 '>
          <View className='justify-start flex-1'>
            <Text className='text-white-text font-pmedium text-lg'>{translations[lang].Welcome}</Text>
            <Text className='text-white-text font-pbold text-2xl'>{name}</Text>
          </View>
          <Image className='h-12 w-12' resizeMode='contain' source={images.logo}/>
        </View>

        <Text className='text-white-text font-psemibold text-lg mt-8'>KrishE Services</Text>

        <View>
          <View className='flex-row justify-evenly'>
            <Services title={translations[lang].MandiBhav} image={images.mandi} navigateTo={'/mandiBhav'}/>
            <Services title={translations[lang].Weather} image={images.weather} navigateTo={'/weather'}/>
          </View>
          <View className='flex-row justify-evenly'>
            <Services title={translations[lang].PlantDoctor} image={images.doctor} navigateTo={'/plantDoctor'}/>
            <Services title={translations[lang].Community} image={images.community} navigateTo={'/community'}/>  
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default home