import React, { useState, useContext, useRef } from 'react'
import { View, Text, Alert, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { translations } from '../../localizations'
import { LanguageContext } from '../../context/LanguageContext'
import DragBox from '../../components/DragBox'
import CustomButton from '../../components/CustomButton'
import { CameraView, useCameraPermissions } from 'expo-camera'

const PlantDoctor = () => {
  const { lang } = useContext(LanguageContext)
  const [permission, requestPermission] = useCameraPermissions()
  const [cameraVisible, setCameraVisible] = useState(false)
  const [image, setImage] = useState(null)
  const cameraRef = useRef(null) // ✅ Ref for CameraView
  const [prediction, setPrediction] = useState(null)

  // Request Camera Permission
  const openCamera = async () => {
    if (!permission?.granted) {
      const response = await requestPermission()
      if (!response.granted) {
        Alert.alert("Permission Denied")
        return
      }
    }
    setCameraVisible(true)
  }

  // Capture Image
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync() // ✅ Correct method
        if (photo?.uri) {
          console.log('Photo captured:', photo.uri)
          setImage(photo.uri) // ✅ Store captured image
          setCameraVisible(false) // ✅ Close camera after capture
        } else {
          Alert.alert("Error", "Failed to capture image")
        }
      } catch (error) {
        console.error('Error capturing photo:', error)
        Alert.alert("Error", "Could not take photo")
      }
    }
  }

  const handleSubmit = async () => {
    if (!image) {
        Alert.alert("Error", "No image selected");
        return;
    }
 
    const formData = new FormData();
    
    // Create the file object properly for React Native
    formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "image.jpg",
    });
 
    try {
        const response = await fetch('https://plant-disease-model-fastapi-server.onrender.com/predict', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                // Remove the Content-Type header - it will be set automatically
            },
        });
 
        const contentType = response.headers.get('Content-Type');
        console.log('Response Content-Type:', contentType);
 
        const responseText = await response.text();
        console.log('Raw response:', responseText);
 
        if (response.ok && contentType?.includes('application/json')) {
            const result = JSON.parse(responseText);
            setPrediction(result); // Store the prediction in state
            Alert.alert("Prediction", `Class: ${result.class}, Confidence: ${result.confidence}`);
        } else {
            console.error('Server error:', responseText);
            Alert.alert("Error", "Failed to get prediction");
        }
    } catch (error) {
        console.error('Error submitting image:', error);
        Alert.alert("Error", "Could not submit image");
    }
};
 



  return (
    <SafeAreaView className='flex-1 bg-primary justify-center items-center px-4'>
      <Text className="text-3xl font-psemibold text-white-text mb-4 px-4">
        {translations[lang].PlantDoctor}
      </Text>

      {cameraVisible ? (
        <View className='w-full h-screen-safe-offset-0 mb-20 rounded-xl'>
          <CameraView
            ref={cameraRef} // ✅ Attach ref to CameraView
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
            facing="back"
            enableTorch={false}
            autofocus="on"
            zoom={0}
          >
            {/* Capture Button */}
            <TouchableOpacity onPress={takePhoto} className='mb-10'>
              <View className='w-20 h-20 bg-white rounded-full border-gray-400 border-4 justify-center items-center'></View>
            </TouchableOpacity>
          </CameraView>
        </View>
      ) : (
        <DragBox onPress={openCamera} photo={image} />
      )}

{image && !prediction && (
  <View className='w-full px-4'>
    <CustomButton containerStyles='w-full' title={translations[lang].Submit} handlePress={handleSubmit} />
  </View>
)}

{prediction && (
  <View className='w-full px-4 mt-5 rounded-2xl h-32 mx-8 justify-center bg-green-form_bg border-2 border-green-form_border'>
    <Text className='text-white-text text-base font-psemibold'>
      Predicted Class: <Text className='font-pregular'>{prediction.class}</Text>
    </Text>
    <Text className='text-white-text text-base font-psemibold'>
      Confidence: <Text className='font-pregular'>{prediction.confidence}</Text>
    </Text>
  </View>
)}


      <StatusBar style="light" />
    </SafeAreaView>
  )
}

export default PlantDoctor
