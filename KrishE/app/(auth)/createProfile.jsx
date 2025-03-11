import { View, Text, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";
import { translations } from '../../localizations';
import { LanguageContext } from '../../context/LanguageContext';
import { StatusBar } from 'expo-status-bar';
import FormField from '../../components/FormField1';
import CustomButton from '../../components/CustomButton';
import Selector from '../../components/Selector';
import { thumbnails } from '../../constants';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { LoginContext } from '../../context/LoginContext';

const createProfile = () => {

  const {lang} = useContext(LanguageContext);

  const plantsArray = thumbnails ? Object.keys(thumbnails) : [];
  const plantLabels = Object.values(translations[lang].plants)
  const [selectedItems, setSelectedItems ] = useState([]);
  const [name, setName ] = useState('');

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(error);
      return;
    }
    const user = data.session.user;
  
    // Step 1: Check if profile already exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('farmer_data')
      .select('*')
      .eq('id', user.id)
      .single();
  
    if (profileCheckError && profileCheckError.code !== 'PGRST116') { 
      // PGRST116 means "No rows found", which is expected if the user has no profile
      console.log("Error checking profile:", profileCheckError);
      return;
    }
  
    if (existingProfile) {
      console.log("Profile already exists, redirecting...");
      router.replace('/home');
      return; // Stop execution here
    }
  
    // Step 2: Insert new profile if it doesn't exist
    const { data: profileData, error: profileError } = await supabase
      .from('farmer_data')
      .insert([{ id: user.id, name: name, crops: selectedItems }]);
  
    if (profileError) {
      console.log(profileError);
      return;
    }
  
    console.log("Profile created:", profileData);
    router.replace('/home');
  };
  
  

  return (
    <SafeAreaView className='bg-primary h-full justify-between'>
      
        
        <View className='justify-start py-20 flex-1 items-center w-full px-4'>
          <Image source={images.logo_title}  className='w-30 h-10 mb-20' resizeMode='contain'/>
        </View>
        <View className='mb-10 px-4'>
          <Text className='text-xl font-pregular text-white-text'>{translations[lang].Name}</Text>
          <FormField text_colour='text-white-text' background_colour='bg-green-form_bg' border_colour='border-green-form_border' handleChangeText={setName}/>
          <Text className='text-xl font-pregular text-white-text my-5'>{translations[lang].Crops}</Text>
          <Selector data={plantsArray} numCols={3} labels={plantLabels} selectedItems={selectedItems} onSelect={setSelectedItems}/>
        </View>
        <View className='mb-20 px-4'>
          <CustomButton 
            title={translations[lang].Submit} 
            handlePress={handleSubmit}
          />
        </View>
      <StatusBar style='light'/>
    </SafeAreaView>
  )
}

export default createProfile