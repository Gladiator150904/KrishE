import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ title, containerStyles, handlePress, textStyles, isLoading, loadingText=title }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    >
      <LinearGradient
        colors={['#9AC100', '#357A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 12,
          height: 64, // Fix height (same as h-16 in Tailwind)
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16, // Prevents text from being too close to edges
          marginTop:20
        }}
      >
        <Text className={`font-psemibold text-lg text-white ${textStyles}`}>{isLoading? loadingText : title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;