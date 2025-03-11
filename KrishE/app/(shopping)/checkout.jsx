import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { icons } from '../../constants';
import { router } from 'expo-router';
import { Linking } from 'react-native';

const checkout = () => {
  const { cartItems } = useContext(CartContext);

  const [amount, setAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    const calculateAmount = () => {
      let total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setSubtotal(total);
      const taxRate = 0.18;
      setTax(taxRate);
      const delivery = total > 1000 ? 0 : 50;
      setDeliveryCharges(delivery);
      setDiscount(0);
      setAmount(total + total * taxRate + delivery);
    };
    
    calculateAmount();
  }, [cartItems]);

  useEffect(() => {
    const handleDeepLink = (event) => {
      parseUPIResponse(event.url);
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (paymentMethod && orderPlaced !== null) {
      orderPlaced ? router.push('/orderPlaced') : alert('Payment Failed');
    }
  }, [orderPlaced]);

  const handleUPI = async () => {
    const UpiUrl = `upi://pay?pa=gladiator150904@oksbi&pn=Akshat%20Ranjan&am=${amount}&cu=INR&tn=Payment%20for%20Order&tr=order_12345&url=myapp://upi-response`;
    setPaymentMethod('UPI');
    const supported = await Linking.canOpenURL(UpiUrl);
    if (supported) {
      await Linking.openURL(UpiUrl);
    } else {
      alert('UPI Payment is not supported on your device');
    }
  };

  const parseUPIResponse = (url) => {
    if (url) {
      const params = new URLSearchParams(url.split('?')[1]);
      const status = params.get('Status');
      const txnId = params.get('txnId');

      if (status === 'SUCCESS') {
        alert(`Payment successful! Transaction ID: ${txnId}`);
        setOrderPlaced(true);
      } else {
        alert('Payment failed or cancelled');
        setOrderPlaced(false);
      }
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-primary flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16}}>
        <Text className="text-3xl text-white font-pbold text-center mt-20">Checkout</Text>
        <View className="w-full bg-white-text rounded-lg justify-center shadow-lg p-4 mt-5">
          <Text className="text-2xl font-pbold text-black">Your Order</Text>
          <View className="h-0.5 w-full bg-black mt-2"></View>
          {cartItems.map((item, index) => (
            <View key={index}>
              <View className="flex-row w-full justify-between my-5">
                <Text className="text-lg font-pregular flex-1">{item.name} - ({item.quantity}x)</Text>
                <Text className="text-lg font-pregular">{item.price * item.quantity}</Text>
              </View>
              <View className="h-0.5 w-full bg-black"></View>
            </View>
          ))}
          <View className="flex-row justify-between mt-5">
            <Text className="text-xl font-pregular">Subtotal: </Text>
            <Text className="text-xl font-pregular">₹{subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xl font-pregular">Tax: </Text>
            <Text className="text-xl font-pregular">₹{(subtotal * tax).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xl font-pregular">Delivery Charges: </Text>
            <Text className="text-xl font-pregular">₹{deliveryCharges.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xl font-pregular">Discount: </Text>
            <Text className="text-xl font-pregular">₹{discount.toFixed(2)}</Text>
          </View>
          <View className="h-0.5 w-full bg-black mt-2"></View>
          <View className="flex-row justify-between mt-5">
            <Text className="text-xl font-pregular">Total: </Text>
            <Text className="text-xl font-pregular">₹{amount.toFixed(2)}</Text>
          </View>
          <View className="h-0.5 w-full bg-black mt-2"></View>
        </View>

        <View className="w-full rounded-lg justify-center shadow-lg mt-5 mb-20">
          <TouchableOpacity activeOpacity={0.7} className="w-full bg-green-form_bg rounded-t-lg p-4 items-center border-2 border-green-form_border flex-row justify-between">
            <Text className="text-xl font-pregular text-white-text">Netbanking</Text>
            <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUPI} activeOpacity={0.7} className="w-full bg-green-form_bg p-4 items-center border-2 border-green-form_border flex-row justify-between">
            <Text className="text-xl font-pregular text-white-text">UPI</Text>
            <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/orderPlaced')} activeOpacity={0.7} className="w-full bg-green-form_bg rounded-b-lg p-4 items-center border-2 border-green-form_border flex-row justify-between">
            <Text className="text-xl font-pregular text-white-text">Cash On Delivery</Text>
            <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default checkout;
