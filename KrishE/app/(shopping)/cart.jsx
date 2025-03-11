import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const cart = () => {

  const { cartItems, setCartItems } = useContext(CartContext)

  const addToCart = (item) => {
    const isInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isInCart) {
      setCartItems(
        cartItems.map((cartItem) => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      )
    }
    else{
      setCartItems([...cartItems, {...item, quantity: 1}])
    }
  }

  const removeFromCart = (item) => {
    const isInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isInCart.quantity === 1){
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    }
    else{
      setCartItems(
        cartItems.map((cartItem) => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
      )
    }
  }

  return (
    <SafeAreaView className='w-full h-full bg-primary items-center flex-1'>
      <Text className='text-white-text text-3xl font-pbold mt-20'>Cart</Text>
      <ScrollView className='w-full my-5 px-4' contentContainerStyle={{justifyContent: 'center'}}>
        <Text className='text-white-text font-pregular mb-5 mt-10'>
          {cartItems.length === 0 ? 'Your cart is empty' : `You have ${cartItems.length} items in your cart`}
        </Text>
        {cartItems.length > 0 ? (
          <View className='w-full h-full'>
            {cartItems.map((item, index) => (
              <View key={index} className='flex-row w-full mb-5'>
                <TouchableOpacity className='w-1/3 h-40 bg-white-text rounded-l-lg'>
                  <Image source={item.image ? { uri: item.image[0] } : undefined} className='w-full h-full rounded-l-lg' resizeMode='cover' />
                </TouchableOpacity>
                <View className='w-2/3 h-40 bg-white rounded-r-lg p-2 justify-between'>
                  <View>
                    <Text className='text-primary font-pregular text-lg'>{item.name}</Text>
                    <Text className='text-primary font-plight text-xs'>{item.brand}</Text>
                  </View>
                  <View className='flex-row justify-between items-center mt-2'>
                    <Text className='text-primary font-pregular text-lg'>₹{item.price}</Text>
                    <View className='flex-row items-center'>
                      <TouchableOpacity className='bg-primary rounded-full w-8 h-8 justify-center items-center' activeOpacity={0.7} onPress={() => removeFromCart(item)}>
                        <Text className='text-white-text font-pregular text-lg'>-</Text>
                      </TouchableOpacity>
                      <Text className='text-primary font-pregular text-xl mx-3'>{cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0}</Text>
                      <TouchableOpacity className='bg-primary rounded-full w-8 h-8 justify-center items-center' activeOpacity={0.7} onPress={() => addToCart(item)}>
                        <Text className='text-white-text font-pregular text-lg'>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <CustomButton title="Checkout" handlePress={() => router.push('/checkout')} />
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <CustomButton title="Continue Shopping" handlePress={() => router.push('/shop')} />
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  )
}

export default cart