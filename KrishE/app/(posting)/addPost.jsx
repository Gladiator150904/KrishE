import { View, Text, SafeAreaView, Touchable, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FormField1 from '../../components/FormField1'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {decode} from 'base64-arraybuffer'
import { supabase } from '../../lib/supabase';
import { icons } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { LocationContext } from '../../context/LocationContext';
import { router } from 'expo-router';

const addPost = () => {
    
    const {state} = useContext(LocationContext);

    const [media, setMedia] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [urlList, setUrlList] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        console.log("Updated Media: ", media);
        console.log("URL List: ", urlList)
    }, [media,urlList]); // This runs whenever media state updates

    const handleMedia = async() => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                quality: 0.8,
                allowsMultipleSelection: true,
            });
            console.log("ImagePicker result: ",result)
            if (!result.canceled) {
                const newMedia = await Promise.all(
                    result.assets.map(async (asset) => {
                        if (asset.type === "video") {
                            try {
                                const { uri } = await VideoThumbnails.getThumbnailAsync(
                                    asset.uri,
                                    { time: 1000 } // Capture thumbnail at 1s
                                );
                                return { ...asset, thumbnail: uri };
                            } catch (error) {
                                console.error("Thumbnail generation failed:", error);
                                return asset; // Return video without thumbnail if it fails
                            }
                        }
                        return asset; // Return image as is
                    })
                );
                setMedia(prevMedia => [...prevMedia, ...newMedia]);
            }
        } 
        catch (error) {
            console.error('Upload failed:', error);
        }
    }

    const handlePost = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUploading(true);
        try {
            let uploadedUrls = [];
            let filePaths = [];
    
            // Upload files to storage
            await Promise.all(
                media.map(async (file) => {
                    const fileExt = file.uri.split('.').pop();
                    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `${session.user.id}/${Date.now()}/${filename}`;
                    filePaths.push(filePath);
                    
                    // Read file as Base64
                    const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
                    
                    // Upload file
                    const { error } = await supabase.storage
                        .from('PostsMedia')
                        .upload(filePath, decode(base64), {
                            contentType: file.type === 'video' ? 'video/mp4' : 'image/png',
                        });
    
                    if (error) {
                        console.error("Upload Error: ", error);
                        return;
                    }
    
                    // Get public URL of uploaded file
                    const { data: publicUrl } = supabase.storage.from('PostsMedia').getPublicUrl(filePath);
                    if (publicUrl) {
                        uploadedUrls.push(publicUrl.publicUrl);
                    }
                })
            );
    
            // Insert post into database
            const { data, error } = await supabase.from('posts').insert([
                {
                    title: title,
                    description: description,
                    media: uploadedUrls, // Use the collected URLs
                    location: state,
                    farmer_id: session.user.id,
                    filePath: filePaths
                }
            ]);
    
            if (error) {
                console.error("Error in Posting: ", error);
            } else {
                console.log("Post Successful:", data);
                router.back();
            }
        } catch (error) {
            console.error("Post Failed: ", error);
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <SafeAreaView className='w-full h-full bg-primary px-4'>
            <Text className='mt-20 font-pbold text-3xl text-white-text'>
                Add Post
            </Text>
            <FormField1 title={"Title"} background_colour={'bg-green-form_bg'} border_colour={'border-green-form_border'} otherStyles={'mt-5'} text_colour={'text-white-text'} handleChangeText={setTitle}/>
            <FormField1 title={"Description"} multiline={true} background_colour={'bg-green-form_bg'} border_colour={'border-green-form_border'} otherStyles={'mt-5'} text_colour={'text-white-text'} height='h-40' handleChangeText={setDescription}/>
            <View className='bg-green-form_bg border-green-form_border rounded-2xl border-2 mt-5 flex-row p-3 justify-center'>
                {media.length > 0 ? (
                    <ScrollView className='flex-1 flex-row' horizontal contentContainerStyle={{gap: 10}} showsHorizontalScrollIndicator={false}>
                        {media.map((item, index) => (
                            <View key={index} className='w-16 h-16 overflow-hidden'>
                                <Image source={{uri: item.type==='video' ? item.thumbnail || item.uri : item.uri}} className='w-16 h-16 rounded-lg' resizeMode='cover' />
                                <Image source={item.type==='video' && icons.play} className='w-5 h-5 left-1 bottom-1 absolute' tintColor={'white'}/>
                            </View>
                        ))}
                        <TouchableOpacity className='bg-green-form_border w-16 h-16 rounded-lg' activeOpacity={0.6} onPress={handleMedia}>
                            <Text className='text-primary text-6xl text-center mt-2'>+</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ):(
                    <TouchableOpacity className='flex-1 justify-center items-center' onPress={ handleMedia }>
                        <Text className='text-center font-pregular text-white-text'>Add Media</Text>
                    </TouchableOpacity>
                )}
            </View>
            <CustomButton title={'Post'} handlePress={handlePost} isLoading={uploading} loadingText={'Posting...'}/>
        </SafeAreaView>
    )
}

export default addPost