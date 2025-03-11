import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useContext, useEffect } from 'react'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { images } from '../constants'
import { LoginContext } from '../context/LoginContext'

export default function App(){

  const { user, loading } = useContext(LoginContext);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [user, loading]);

  return(
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{
        height:'100%'
      }}>
        <View className='justify-center h-full items-center flex w-full px-4'>

          <Image source={images.logo_title} className='w-30 h-10 mb-8' resizeMode='contain'/>
          <Image source={images.cards} className='max-w-100 h-100' resizeMode='contain'/>
        
          <Text className='text-3xl font-psemibold text-white-300 text-center mt-4'>Cultivate Tomorrow's{'\n'}Harvest with
            <Text className='text-green-100'>{' '}KrishE</Text>
          </Text>
          <CustomButton 
            title={'Explore KrishE'}
            containerStyles='w-full mt-7'
            handlePress={() => router.push('/language')}
          />
          <StatusBar style='light'/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}