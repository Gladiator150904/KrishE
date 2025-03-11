import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { LocationContext } from '../../context/LocationContext';
import { Video } from 'expo-av';
import { RefreshControl } from 'react-native';
import { icons } from '../../constants';
import FormField1 from '../../components/FormField1';
import CustomButton from '../../components/CustomButton';

const managePosts = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(Array(100).fill(true)); // Ensure all videos start muted
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const videoRefs = useRef({});
    const [modalIndex, setmodalIndex ] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {    
        setModalVisible(false);
    }   

    const handleDelete = async () => {
        if (modalIndex === null || modalIndex >= posts.length) {
            console.error("Invalid modal index");
            return;
        }
    
        try {
            const { data: profileData, error: profileError } = await supabase.auth.getSession();
            if (profileError) {
                console.error('Error fetching profile data:', profileError);
                return;
            }
    
            const userId = profileData.session.user.id;
            const postToDelete = posts[modalIndex];
            console.log("Post to delete:", postToDelete);
    
            if (!postToDelete.filePath || postToDelete.filePath.length === 0) {
                console.error("No file paths found for this post");
                return;
            }
    
            console.log("Deleting media files:", postToDelete.filePaths);
    
            // Delete media files from Supabase Storage
            const { error: bucketDeleteError } = await supabase.storage.from('PostsMedia').remove(postToDelete.filePath);
            if (bucketDeleteError) {
                console.error("Error deleting media from storage:", bucketDeleteError);
                return;
            }
    
            // Delete post from Database
            const { error: postDeleteError } = await supabase
                .from('posts')
                .delete()
                .eq('farmer_id', userId)
                .eq('created_at', postToDelete.created_at);
    
            if (postDeleteError) {
                console.error("Error deleting post:", postDeleteError);
                return;
            }
    
            console.log("Post deleted successfully");
    
            // Remove post from UI state
            setPosts((prevPosts) => prevPosts.filter((_, index) => index !== modalIndex));
    
            // Close Modal
            setModalVisible(false);
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const handleSave = async() => {
        setIsSaving(true);
        try {
            const postToEdit = posts[modalIndex];
            const { data: profileData, error: profileError } = await supabase.auth.getSession();
            if (profileError) {
                console.error('Error fetching profile data:', profileError);
                return;
            }
            const userId = profileData.session.user.id;
            console.log("Post to edit:", postToEdit);
            const {error} = await supabase.from('posts').update({title: newTitle, description: newDescription}).eq('farmer_id', userId).eq('created_at', postToEdit.created_at);
            if(error){
                console.error('Error updating post:', error);
                return;
            }
            setNewTitle('');
            setNewDescription('');
            setIsEditing(false);
        }
        catch (error) {
            console.error("Unexpected error:", error);
        }
        finally{
            setIsSaving(false);
            setIsEditing(false);
            setModalVisible(false);
            fetchPosts();
        }
    }

    const fetchPosts = async () => {
    const {data: profileData, error: profileError} = await supabase.auth.getSession();
    if(profileError) {
        console.error('Error fetching profile data:', profileError);
        setLoading(false);
        return;
    }
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('farmer_id', profileData.session.user.id);

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    setPosts(postsData.reverse() || []);
    setLoading(false);
  };

  // Fetch posts
  useEffect(() => {
      fetchPosts();
      console.log(posts);
  }, []);

  // Fetch avatars and usernames (optimized)
  useEffect(() => {
    const fetchUsers = async () => {
      const farmerIds = [...new Set(posts.map((post) => post.farmer_id))]; // Unique farmer IDs
      if (farmerIds.length === 0) return;

      const { data, error } = await supabase
        .from('farmer_data')
        .select('id, avatar, name')
        .in('id', farmerIds);

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const userMap = data.reduce((acc, user) => {
        acc[user.id] = { avatar: user.avatar, name: user.name };
        return acc;
      }, {});

      setUsers(userMap);
    };

    fetchUsers();
  }, [posts]);

  // Handle mute/unmute toggle
  const toggleMute = (index) => {
    setIsMuted((prev) => ({ ...prev, [index]: !prev[index] }));
    const video = videoRefs.current[index];
    if (video) {
      video.setIsMutedAsync(!isMuted[index]);
    }
  };

  // Render each post
  const renderItem = ({ item, index }) => (
    <View className="bg-white rounded-lg p-4 mt-4">
      {/* User Info */}
      {users[item.farmer_id] && (
        <View className="flex-row items-center mb-2 justify-between">
            <View className='flex-row items-center'>
                <Image
                    source={{ uri: users[item.farmer_id].avatar.replace(/(\?.*)$/, '')}}
                    className="w-10 h-10 rounded-full"
                    onError={(error) => console.log("Avatar Load Error:", error.nativeEvent)}
                />
                <Text className="font-pbold text-lg text-black ml-2">{users[item.farmer_id].name}</Text>
            </View>
            <TouchableOpacity 
                className='gap-1 px-2 flex-row items-center h-8' 
                onPress={() => {
                    setmodalIndex(index);
                    openModal();
                }}
            >
                <View className='w-1 h-1 bg-black rounded-full'></View>
                <View className='w-1 h-1 bg-black rounded-full'></View>
                <View className='w-1 h-1 bg-black rounded-full'></View>
            </TouchableOpacity>
        </View>
      )}
  
      {/* Media Content */}
      <FlatList
        horizontal
        data={item.media}
        keyExtractor={(media, mediaIndex) => `${index}-${mediaIndex}`}
        showsHorizontalScrollIndicator={true}
        snapToInterval={300}
        onScroll={(event) => {setCurrentIndex(Math.floor(event.nativeEvent.contentOffset.x / 300))}}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item: media, index: mediaIndex }) => {
          console.log("Media URL:", media); // Debugging line
          console.log("Muted: ", isMuted[index]); // Debugging line
  
          const isVideo = media.endsWith('.mp4') || media.includes('video'); // Check if it's a video
          return isVideo ? (
            <TouchableOpacity key={mediaIndex} onPress={() => toggleMute(index)} activeOpacity={0.7}>
              <Video
                ref={(ref) => (videoRefs.current[index] = ref)}
                source={{ uri: media }}
                shouldPlay={true}
                isLooping
                style={{ width: 300, height: 200, borderRadius: 10 }}
                resizeMode="cover"
                isMuted={isMuted[index]}
              />
              {/* Speaker Icon (Only for Videos) */}
              <View className="absolute right-2 bottom-4 bg-black/50 rounded-full w-8 h-8 flex-row justify-center items-center">
                <Image source={isMuted[index] ? icons.mute : icons.unmute} className="w-6 h-6" tintColor={'white'} />
              </View>
            </TouchableOpacity>
          ) : (
            <Image
              key={mediaIndex}
              source={{ uri: media }}
              style={{ width: 300, height: 200, borderRadius: 10 }}
              onError={(error) => console.log("Image Load Error:", error.nativeEvent)}
            />
          );

        }}
      />
      <View className="flex-row justify-center mt-2">
        {item.media.length > 1 && item.media.map((_, mediaIndex) => (
          <View
            key={mediaIndex}
            className={`w-2 h-2 mx-0.5 rounded-full ${
              currentIndex === mediaIndex ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
  
      {/* Post Title & Description */}
      <Text className="font-psemibold text-lg text-black mt-2">{item.title}</Text>
      <Text className="font-pregular text-sm text-black">{item.description}</Text>
      <Text className="font-pregular text-sm text-gray-500 ml-2 text-right flex-1">{new Date(item.created_at).toLocaleDateString()}</Text>

    </View>
  );
  
  return (
    <SafeAreaView className="w-full h-full bg-primary px-4">
        <View className="mt-20">
            <Text className="text-center font-pbold text-3xl text-white-text">Your Posts</Text>
        </View>

        {loading ? (
            <Text className="text-center text-white-text mt-5">Loading...</Text>
        ) : (
            <FlatList
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
            />
        )}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className='flex-1 justify-end items-center bg-black/50'>
            <View className={`bg-white w-11/12 ${isEditing? 'h-2/3' : 'h-1/3'} rounded-t-2xl p-4`}>
            <View className='flex-row justify-between items-center my-5'>
                <Text className='font-psemibold text-2xl text-black'>Post Options</Text>
                <TouchableOpacity onPress={closeModal}>
                <Image source={icons.close} className='w-6 h-6' resizeMode='contain'/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-full rounded-lg p-4 items-center border-b-2 border-white-text flex-row justify-between" onPress={() => 
                {
                    setIsEditing(!isEditing);
                    setNewTitle(posts[modalIndex].title);
                    setNewDescription(posts[modalIndex].description);
                }}
            >
                <Text className="text-lg font-psemibold text-black">Edit</Text>
                <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" tintColor={'black'}/>
            </TouchableOpacity>
            {isEditing && (
                <View>
                    <FormField1 title={"Title"} background_colour={'bg-white'} border_colour={'border-white-text-300'} otherStyles={'mt-5'} text_colour={'text-black'} handleChangeText={setNewTitle}/>
                    <FormField1 title={"Description"} multiline={true} background_colour={'bg-white'} border_colour={'border-green-form_border'} otherStyles={'mt-5'} text_colour={'text-black'} height='h-40' handleChangeText={setNewDescription}/>
                    <CustomButton title={'Save'} handlePress={handleSave}containerStyles={'mb-5'} isLoading={isSaving}/>
                </View>
            )}
            <TouchableOpacity disabled={isEditing} className="w-full rounded-lg p-4 items-center border-b-2 border-white-text flex-row justify-between" onPress={handleDelete}>
                <Text className="text-lg font-psemibold text-red-700">Delete</Text>
                <Image source={icons.arrow_down} className="-rotate-90 h-5 w-5" tintColor={'#b91c1c'}/>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    
    </SafeAreaView>
  );
}

export default managePosts