import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import { useState } from 'react';
import { icons } from '../constants';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../localizations';
import { supabase } from '../lib/supabase';

const DropDown2 = ({onSelect}) => {
    const [crops, setCrops] = useState([]);
    const { lang } = useContext(LanguageContext);

    useEffect(() => {
        const fetchCrops = async () => {
          try{
            const { data: { session } } = await supabase.auth.getSession();
            const { data: cropsData, error: cropsError } = await supabase.from('farmer_data').select('crops').eq('id', session.user.id);
            if(cropsError){
              throw cropsError;
            } 
            setCrops(cropsData[0].crops);
          }
          catch(error){
            console.log(error);
          }
        }
        fetchCrops();
    },[]);
    
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState('Select');

    const cropNames = crops.map((crop) => translations[lang].plants[crop]);

    return (
        <View className='w-full'>
            <TouchableOpacity 
                className={`flex-row min-h-[62px] flex-1 items-center justify-between mt-7 bg-green-form_bg border-3 border-green-form_border border-2 px-4 ${expanded ? 'rounded-t-xl' : 'rounded-xl'}`}
                activeOpacity={0.7} 
                onPress={() => (setExpanded(!expanded))}
            >
                <Text className='text-white-text text-xl font-pregular'>{value}</Text>
                <Image className={expanded ? 'h-6 w-6 rotate-180':'h-6 w-6 items-end'} resizeMode='contain' source={icons.arrow_down}/>
            </TouchableOpacity>

            {expanded && (
                <View className={`mt-1 bg-green-form_bg border-3 border-green-form_border rounded-b-xl`}>
                    <ScrollView>
                    {cropNames.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => {
                                setValue(item);
                                onSelect(item);
                                setExpanded(false);
                            }}
                        >
                        <Text className='text-white-text text-xl font-pregular px-4 py-4'>
                            {item}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

export default DropDown2

