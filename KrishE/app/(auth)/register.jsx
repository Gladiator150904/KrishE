import { View, Text, TouchableOpacity, Alert, Image, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import { StatusBar } from 'expo-status-bar'
import FormField1 from '../../components/FormField1'
import OTPForm from '../../components/OTPForm'
import { router } from 'expo-router'
import { images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase';

const register = () => {
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState(null);
  const {lang} = useContext(LanguageContext);
  const [otp, setOtp] = useState('');

  function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Validates Indian 10-digit phone numbers
    return phoneRegex.test(phone);
  }

  async function handleSend() {
    if (!phone) {
      Alert.alert("Error", "Phone Number is required");
      return;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Invalid Phone Number. Please enter a 10-digit valid number.");
      return;
    }
    try {
      console.log("Sending SMS to ", phone);
      const { error } = await supabase.auth.signInWithOtp({ phone: "+91" + phone });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  async function handleSubmit() {
    if(otp.length === 6){
      const { error } = await supabase.auth.verifyOtp({ phone: '+91'+phone, token: otp, type: 'sms' })
      if (error) {
        Alert.alert("Error", error.message);
      } 
      else {
        router.push('/createProfile');
      }
    } else {
      Alert.alert("Error", "Incorrect OTP");
    }
  }
  
  return (
    <SafeAreaView className='bg-primary h-full justify-between items-center'>
      <Image source={images.logo_title}  className='w-30 h-10 mb-8 mt-28' resizeMode='contain'/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <>
        <View >
          <Text className='text-white-text font-psemibold text-center text-2xl mt-20'>{translations[lang].Register}</Text>
        </View>
        <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>
        {!sent?(
          <View className='w-80 h-96 rounded-xl bg-green-bg shadow-dark mt-5 mb-56 justify-between'>
            <View className='px-4 mt-16' behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} enabled >
              <Text className='text-white-text text-xl font-psemibold'>{translations[lang].PhNo}</Text>
              <FormField1  keyboardType={'numeric'} handleChangeText={setPhone} maxLength={10} minLength={10} text_colour='text-green-primary' background_colour='bg-white-text' border_colour='border-white-borders'/>
              <Text className='mt-4 font-pregular text-white-text'>{translations[lang].RegDesc}</Text>
            </View>
            <TouchableOpacity className='items-center mb-10' onPress={handleSend} disabled={!phone}>
              <Text className={`font-psemibold text-lg ${phone? 'text-green-button' : 'text-gray-600'}`}>Send</Text>
            </TouchableOpacity>
          </View>
        ):(
          <View className='w-80 h-96 rounded-xl bg-green-bg shadow-dark mt-5 mb-56 justify-between'>
            <View className='px-4 mt-16'>
              <Text className='text-white-text text-xl font-psemibold mb-4'>{translations[lang].OTP}</Text>
              <OTPForm getOTP={setOtp}/>
              
              <View className='flex-row justify-between mt-4'>
                <Text className='font-pregular text-white-text w-44'>
                  {translations[lang].OTPDesc + '+91' + phone}
                </Text>
                <TouchableOpacity onPress={() => setSent(false)}>
                  <Text className='text-green-button font-pregular'> Change</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSend}>
                <Text className='text-green-button font-psemibold mt-4'> Resend</Text>
              </TouchableOpacity>
              
            </View>
            <TouchableOpacity className='items-center mb-10' onPress={handleSubmit}>
              <Text className='text-green-button font-psemibold text-lg'>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
        </ScrollView>
        </>
      </TouchableWithoutFeedback>
      
      <StatusBar style='light'/>
    </SafeAreaView>
  )
}

export default register