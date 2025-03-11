import React, { useRef, useState } from 'react'
import { SafeAreaView, Text } from 'react-native'

const orderPlaced = () => {
  const ref = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <SafeAreaView className='w-full h-full bg-primary flex justify-center items-center'>
      <Text className='text-white text-2xl font-pbold'>Order Placed</Text>
    </SafeAreaView>
  )
}

export default orderPlaced