import { View, Text, ScrollView, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import DropDown from '../../components/DropDown'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import { images } from '../../constants'

const language = () => {
  
  const {lang} = useContext(LanguageContext);
  
  return (
    <SafeAreaView className='bg-primary h-full justify-between'>
      <ScrollView contentContainerStyle={{
        height:'100%'
      }}>
        
        <View className='justify-start py-20 flex-1 items-center w-full px-4'>
        <Image source={images.logo_title}  className='w-30 h-10 mb-20' resizeMode='contain'/>
          <Text className='text-2xl font-psemibold text-white-text'>{translations[lang].ChooseLanguage}</Text>
          <DropDown />
        </View>
        <View className='w-full px-4 pb-20 justify-center items-center h-30'>
          <CustomButton containerStyles={`w-full`} title={translations[lang].Continue} handlePress={()=>router.replace('/register')}/>
        </View>
      </ScrollView>
      <StatusBar style='light'/>
    </SafeAreaView>
  )
}

export default language