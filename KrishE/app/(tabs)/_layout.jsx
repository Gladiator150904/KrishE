import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'


const TabIcon = ({ icon, color, name, focused }) => {
  return(
    <View className=' justify-start items-center pt-6 gap-y-1'>
      <Image tintColor={color} className='w-7 h-7' resizeMode='contain' source={icon}/>
      <Text className={`${ focused? 'font-psemibold' : 'font-pregular'} text-xs w-full`} style={{color: color}} >{name}</Text>
    </View>
  )
}


const TabsLayout = () => {

  const {lang} = useContext(LanguageContext);

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#5C8634",
          tabBarInactiveTintColor: "#DDDDDD",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#16221C",
            borderTopWidth: 1,
            borderColor: "#3B4741",
            height: 84,
          },
          animation: 'shift'
      }}
    >
      <Tabs.Screen 
        name='home'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({color, focused}) => (
            <TabIcon 
              icon={icons.home}
              color={color}
              name={translations[lang].Home}
              focused={focused}
            />
          ),
        }}    
      />
      <Tabs.Screen 
        name='news'
        options={{
          headerShown: false,
          title: "News",
          tabBarIcon: ({color, focused}) => (
            <TabIcon 
              icon={icons.news}
              color={color}
              name={translations[lang].News}
              focused={focused}
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name='shop'
        options={{
          headerShown: false,
          title: "Shop",
          tabBarIcon: ({color, focused}) => (
            <TabIcon 
              icon={icons.shop}
              color={color}
              name={translations[lang].Shop}
              focused={focused}
            />
          ),
          animation: "fade"
        }} 
      />
      <Tabs.Screen 
        name='profile'
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({color, focused}) => (
            <TabIcon 
              icon={icons.profile}
              color={color}
              name={translations[lang].Profile}
              focused={focused}
            />
          ),
        }} 
      />
    </Tabs>
    <StatusBar style='light' />
    </>
  )
}

export default TabsLayout