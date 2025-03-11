import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const ShoppingLayout = () => {
  return (
    <>
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='cart'/>
            <Stack.Screen name='checkout'/>
            <Stack.Screen name='orderPlaced'/>
        </Stack>
        <StatusBar style='light'/>
    </>
  )
}

export default ShoppingLayout