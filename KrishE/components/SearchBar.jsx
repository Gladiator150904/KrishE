import { icons } from "../constants";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Image, TouchableOpacity } from "react-native";

const SearchBar = ({
  onSearch,
  setItems,
  searching,
  ...props
}) => {

  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSearch = async() => {
    try{
      setLoading(true);
      onSearch(keyword);
      searching(true);
      const { data, error } = await supabase.from('products').select('*').ilike('name', `%${keyword}%`);
      if(error){
        console.log(error);
      }
      setItems(data);
    }
    catch (error){
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <View className={`space-y-2 `}>

      <View className={`w-full h-16 px-4 bg-green-form_bg border-green-form_border rounded-2xl border-2 flex-row items-center`}>
        <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          className={`flex-1 font-pmedium text-lg items-center justify-center text-white`}
          {...props}
          placeholder="Search..." 
          placeholderTextColor={'#3B4741'}    
          onChangeText={(text) => setKeyword(text)}     
        />
        </ScrollView>
        <TouchableOpacity onPress={handleSearch}>
          <Image source={icons.search} className='h-6 w-6' tintColor={'white'}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
