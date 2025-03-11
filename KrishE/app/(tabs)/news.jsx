import { View, Text, Image, TouchableOpacity, Linking, RefreshControl } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import { FlatList } from 'react-native'
import useNews from '../../hooks/useNews'
import { images } from '../../constants'

const news = () => {

  const {lang} = useContext(LanguageContext);

  const { articles: data, loading, fetchNews } = useNews();

  const handlePress = (url) => () => {
    if(url){
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  }

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(); // Call the fetch function from the hook
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='bg-primary h-full px-4'>
      
      <View className='mt-11 mb-5 flex-row justify-between items-center'>
        <Text className='text-2xl text-white-text font-pbold'>{translations[ lang ].News}</Text>
        <Image source={images.logo} className='w-12 h-12' resizeMode='contain' />
      </View>
      
      {loading ? (
        <View className='flex-1 justify-center'>
          <Text className='text-white-text font-psemibold text-lg text-center'>Loading...</Text>
        </View>
        ) : (
          <View className='flex-1'>
            <FlatList
              data={data}
              keyExtractor={(item) => item.url}
              renderItem={({ item }) => (
                <TouchableOpacity className='bg-white-text rounded-3xl p-4 mb-4' activeOpacity={0.8} onPress={handlePress(item.url)}>
                  <Image source={{ uri: item.image }} className='w-full h-44 rounded-xl mb-2' resizeMode='cover' />
                  <Text className='text-black text-sm font-psemibold'>{item.title}</Text>
                  <Text className='text-black text-xs font-pregular'>{item.description}</Text>
                </TouchableOpacity>
              )}
              scrollsToTop={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16221C']} tintColor='#fff' />
              }
            />
          </View>
        )}
    </SafeAreaView>
  )
}

export default news