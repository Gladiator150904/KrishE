import { icons, images } from '../../constants'
import { LanguageContext } from '../../context/LanguageContext'
import { translations } from '../../localizations'
import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import  SearchBar  from '../../components/SearchBar'
import { supabase } from '../../lib/supabase'
import {CartContext} from '../../context/CartContext'
import { router } from 'expo-router'

const shop = () => {

  const {cartItems, setCartItems} = useContext(CartContext)
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [category, setCategory] = useState('');
  console.log("Category: ",category);
  console.log("Search Results: ",searchResults);

  const {lang} = useContext(LanguageContext);

  useEffect(() => {
    // Fetch cart items from the backend
    if(category === '') return;
    const fetchCategoryItems = async () => {
      const{ data: categoryItems, error: categoryError} = await supabase.from('products').select('*').eq('category', category);
      if(categoryError) {
        console.log(categoryError);
      }
      setSearchResults(categoryItems);
    }
    fetchCategoryItems();
  }, [category])

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
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <View className='mt-11 mb-5 flex-row justify-between items-center'>
        <Text className='text-2xl text-white-text font-pbold'>{translations[ lang ].Shop}</Text>
        <TouchableOpacity onPress={()=>router.push('/cart')}>
          <Image source={icons.cart} className='w-12 h-12' resizeMode='contain' tintColor={'white'}/>
          <View className='absolute top-0 right-0 bg-white flex-row justify-center rounded-full w-5 h-5 items-center'>
            <Text className='text-black font-pbold text-lg justify-self-center'>{cartItems.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <SearchBar setItems={setSearchResults} onSearch={setCategory} searching={setSearching}/>
      <ScrollView className='mt-5' showsVerticalScrollIndicator={false}>
        <View>
          <Text className='text-white-text font-pregular text-xl'>Choose By Category</Text>
          <View className='flex-row flex-wrap justify-between mt-5'>
            {/* Categories */}
            <TouchableOpacity className='w-1/3 bg-white-300 rounded-l-lg p-2 mb-5 border-r-2 border-white-borders' activeOpacity={0.7} onPress={() => setCategory('Seeds')}>
              <Image source={images.seeds} className='w-full h-20' resizeMode='contain'/>
              <Text className='text-primary font-pregular text-center mt-2'>Seeds</Text>
            </TouchableOpacity>
            <TouchableOpacity className='w-1/3 bg-white-300 p-2 mb-5' activeOpacity={0.7} onPress={() => setCategory('Equipment')}>
              <Image source={images.spray} className='w-full h-20' resizeMode='contain'/>
              <Text className='text-primary font-pregular text-center mt-2'>Equipment</Text>
            </TouchableOpacity>
            <TouchableOpacity className='w-1/3 bg-white-300 rounded-r-lg p-2 mb-5 border-l-2 border-white-borders' activeOpacity={0.7} onPress={() => setCategory('Nutrition')}>
              <Image source={images.fertilizer} className='w-full h-20' resizeMode='contain'/>
              <Text className='text-primary font-pregular text-center mt-2'>Nutrition</Text>
            </TouchableOpacity>
            
            {category&& (
              searchResults.length > 0 ? (
                <View className='flex-row flex-wrap justify-between'>
                  <Text className='text-white-text font-pregular text-lg mb-5'>Browsing "{category}"</Text>
                  {searchResults.map((item, index) => (
                    <View key={index} className='flex-row w-full mb-5'>
                      <TouchableOpacity className='w-1/3 h-40 bg-white-text rounded-l-lg'>
                        <Image source={item.image?{uri: item.image[0]}:undefined} className='w-full h-full rounded-l-lg' resizeMode='cover'/>
                      </TouchableOpacity>
                      <View className='w-2/3 h-40 bg-white rounded-r-lg p-2 justify-between'>  
                        <View>
                          <Text className='text-primary font-pregular text-lg'>{item.name}</Text>
                          <Text className='text-primary font-plight text-xs'>{item.brand}</Text>
                        </View>                  
                        <View className='flex-row justify-between items-center mt-2'>
                          <Text className='text-primary font-pregular text-lg'>₹{item.price}</Text>
                          <View className='flex-row items-center'>
                            <TouchableOpacity className='bg-primary rounded-full w-8 h-8 justify-center items-center' activeOpacity={0.7} onPress={()=>removeFromCart(item)}>
                              <Text className='text-white-text font-pregular text-lg'>-</Text>
                            </TouchableOpacity>
                            <Text className='text-primary font-pregular text-xl mx-3'>{cartItems.find((cartItem)=>cartItem.id===item.id)?.quantity||0}</Text>
                            <TouchableOpacity className='bg-primary rounded-full w-8 h-8 justify-center items-center' activeOpacity={0.7} onPress={()=>addToCart(item)}>
                              <Text className='text-white-text font-pregular text-lg'>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>  
              ) : searching && (
                <View className='w-full h-full justify-center items-center'>
                  <Text className='font-pregular text-white-text text-lg'>No results found</Text>
                </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default shop