import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native-web'

const ServicesLayout = () => {
  return (
    <>
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="community" />
            <Stack.Screen name='mandiBhav' />
            <Stack.Screen name='plantDoctor' />
            <Stack.Screen name='weather' />
        </Stack>
        <StatusBar style='light'/>
    </>
  )
}

export default ServicesLayout