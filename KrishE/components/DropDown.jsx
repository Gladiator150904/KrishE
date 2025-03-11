import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { useState } from 'react';
import { icons } from '../constants';
import { LanguageContext } from '../context/LanguageContext';

const DropDown = ({maxHeight}) => {
    const languages = [
        {label:'en', value :'English'},
        {label:'hi', value:'हिंदी'},
        {label:'pu', value:'ਪੰਜਾਬੀ'},
        {label:'ba', value: 'বাংলা'},
        {label:'gu', value:'ગુજરાતી'},
        {label:'od', value:'ଓଡିଆ'},
        {label:'ta', value:'தமிழ்'},
        {label:'te', value:'తెలుగు'},
        {label:'ma', value:'മലയാളം'},
      ];

    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState('Select');
    const {lang, setLang} = useContext(LanguageContext);

    const onSelect = (item) => {
        setLang(item.label);
        setValue(item.value);
        setExpanded(false);
    }

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
                <View className={`mt-1 bg-green-form_bg border-3 border-green-form_border rounded-b-xl`} style={{height: maxHeight}}>
                    <ScrollView>
                    {languages.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => onSelect(item)}>
                        <Text className='text-white-text text-xl font-pregular px-4 py-4'>
                            {item.value}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

export default DropDown

