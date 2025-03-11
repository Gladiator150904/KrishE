import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const DragBox = ({ onPress, photo }) => {
  return (
    <View className='w-80 justify-center items-center mt-10'>
      <Text className='text-center text-base font-pmedium text-white-text'>
        Upload a clear image of your plant leaf to get an accurate diagnosis of its health 🌿
      </Text>
      <View className='w-80 h-80 justify-center items-center bg-green-form_bg border-2 border-green-form_border rounded-2xl my-5 gap-y-10'>
        {photo ? (
          <Image source={{ uri: photo }} className='w-full h-full rounded-2xl' />
        ) : (
          <View className='justify-center items-center gap-y-5'>
            <TouchableOpacity className='w-10 h-10' onPress={onPress}>
              <Image source={icons.camera} className='w-full h-full' />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className='text-center text-base font-pmedium text-white-text'>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

export default DragBox
