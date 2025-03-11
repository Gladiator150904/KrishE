import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PostingLayout = () => {
  return (
    <>
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='addPost'/>
            <Stack.Screen name='managePosts'/>
        </Stack>
    </>
  )
}

export default PostingLayout