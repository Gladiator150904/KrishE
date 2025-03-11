import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='language'/>
        <Stack.Screen name='register'/>
        <Stack.Screen name='createProfile'/>
    </Stack>
    <StatusBar style='light'/>
    </>
  )
}

export default AuthLayout