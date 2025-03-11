import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { thumbnails } from '../constants'

const Selector = ({onSelect, data, labels, numCols, selectedItems=[]}) => {
  const [localSelectedItems, setLocalSelectedItems] = useState(selectedItems);

  useEffect(() => {
    setLocalSelectedItems(selectedItems)
  }, [selectedItems])

  const handleSelect = (item) => {
    const updatedItems = localSelectedItems.includes(item) ?
      localSelectedItems.filter(i => i !== item) :
      [...localSelectedItems, item];
    setLocalSelectedItems(updatedItems);
    onSelect && onSelect(updatedItems);
  }

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity 
        className='items-center' 
        onPress={() => {handleSelect(item)}}
        activeOpacity={0.8} 
        style={{ flex: 1, margin: 16, }}
      >
        <View className={`${localSelectedItems.includes(item) ? 'border-green-button border-2 p-4 rounded-full' : undefined} h-24 w-24 bg-transparent flex justify-center items-center`}>
          <View className='absolute  bg-white-300 rounded-full p-1'>
            <Image className='h-20 w-20' resizeMode='contain' source={thumbnails[item]}/>     
          </View>
        </View>
        <Text className='font-pmedium text-sm mt-2 text-white-300'>
          {labels[index] || item}
        </Text>
      </TouchableOpacity>
    )
  }

    return (
    <View className={`w-full h-80 bg-green-form_bg rounded-2xl border-2 border-green-form_border focus:border-secondary flex flex-row items-center`}>
        <FlatList nestedScrollEnabled={true} data={data} numColumns={numCols} keyExtractor={item => item} renderItem={renderItem} contentContainerStyle={{padding:12}}/>
    </View>
  )
}

export default Selector;