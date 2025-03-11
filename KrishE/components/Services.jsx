import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Services = ({title, image, navigateTo}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={()=>router.push(navigateTo)}>
        <View  className='h-30 w-44 rounded-2xl items-center bg-white-300 mt-4 mx-2' resizeMode='contain' >
            <Image className='h-28 w-44' resizeMode='contain' source={image} />
            <Text className='text-center text-xl font-pbold text-primary pb-2'>{title}</Text>
        </View>
    </TouchableOpacity>
    
  )
}

export default Services