import { View, Text, Button, Image, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {decode } from 'base64-arraybuffer';
import { LoginContext } from '../../context/LoginContext'
import DropDown from '../../components/DropDown'
import Selector from '../../components/Selector'
import { thumbnails } from '../../constants';



const profile = () => {

  const [name, setName] = useState('');
  const {avatar, setAvatar} = useContext(LoginContext);
  const {lang, setLang} = useContext(LanguageContext);
  const plantsArray = thumbnails ? Object.keys(thumbnails) : [];
  const plantLabels = Object.values(translations[lang].plants);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch Profile Information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data?.session) return;
  
        let avatarUrl = '';
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('farmer_data')
          .select('name, avatar, crops')
          .eq('id', data.session.user.id)
          .single();
  
        if (profileError) throw profileError;
  
        setName(profileData?.name || '');
        setSelectedItems(profileData?.crops || []);
        setAvatar(profileData?.avatar || '');
  
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };
  
    fetchProfile();
  }, []);
  
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    console.log('logout')
    router.push('/register');
  };

  const chooseImage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled) {
        const image = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });
        const filename  = `${session.user.id}/avatar.png`;
        await supabase.storage.from('Avatars').upload(filename, decode(base64), { contentType: 'image/png' , upsert: true});
        const { data: { publicUrl } } = supabase.storage.from('Avatars').getPublicUrl(filename + '?' + new Date().getTime());
        console.log("Public URL: ",publicUrl);
        setAvatar(publicUrl);
        console.log("Avatar: ",avatar)
        await supabase.from('farmer_data').update({ avatar: publicUrl }).eq('id', session.user.id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  const handleSave = async() => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('farmer_data').update({ crops: selectedItems }).eq('id', session.user.id);
    }
    catch (error) {
      console.error('Upload failed:', error);
    }
  }
  
  
  return (
    <SafeAreaView className='h-full bg-primary px-4'>
      <View className='mt-14 mb-5 flex-row justify-between items-center'>
        <Text className='text-2xl text-white-text font-pbold'>{translations[ lang ].Profile}</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={logout}>
        <Image source={icons.logout} className='w-6 h-6' resizeMode='contain' tintColor={'white'}/>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='h-full'>
        <View className='items-center'>
        <TouchableOpacity className='mt-5 items-center border-2 border-white overflow-hidden w-28 h-28 justify-center rounded-full p-2' activeOpacity={0.7} onPress={chooseImage} >
          {avatar? (
            <Image source={{uri: avatar}} className='w-24 h-24 rounded-full justify-center items-center' resizeMode='contain'/>
          ):(
            name && (
            <View className='w-24 h-24 rounded-full self-center bg-white flex justify-center items-center'>
              <Text className='text-4xl text-primary font-pbold pt-2'>{name.charAt(0).toUpperCase()}</Text>
            </View>)
          )}
          
        </TouchableOpacity>
        </View>

        <Text className='text-2xl text-white-text font-pbold mt-3 text-center'>{name}</Text>
        <Text className='text-base text-white-text font-psemibold mt-8'>{translations[ lang ].ChooseLanguage}</Text>
        <DropDown/>
        <View className='flex-row justify-between items-center'>
          <View className='flex-row items-center'>
          <Text className='text-base text-white-text font-psemibold my-7'>
            {translations[lang].Crops}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={icons.edit} className='h-4 w-4 ml-2' tintColor={'white'}/>
          </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={()=>handleSave()}>
            <Text className={`text-base text-green-button font-psemibold my-7`}>Save</Text>
          </TouchableOpacity>
        </View>
        <Selector data={plantsArray} labels={plantLabels} numCols={3} selectedItems={selectedItems} onSelect={setSelectedItems}/>
        <TouchableOpacity activeOpacity={0.7} className="w-full bg-green-form_bg rounded-lg p-4 items-center my-5 border-2 border-green-form_border flex-row justify-between" onPress={()=>router.push('/managePosts')}>
          <Text className="text-xl font-pregular text-white-text">Manage Posts</Text>
          <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile