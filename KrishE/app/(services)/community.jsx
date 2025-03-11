import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LocationContext } from '../../context/LocationContext';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Video } from 'expo-av';
import { icons } from '../../constants';
import { RefreshControl } from 'react-native';
import { Platform } from 'react-native';

const Community = () => {
  const { state } = useContext(LocationContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(Array(100).fill(true)); // Ensure all videos start muted
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef({});

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('location', state);

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
  }, [state]);

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
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: users[item.farmer_id].avatar}}
            className="w-10 h-10 rounded-full"
            onError={(error) => console.log("Avatar Load Error:", error.nativeEvent)}
          />
          <Text className="font-pbold text-lg text-black ml-2">{users[item.farmer_id].name}</Text>
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
    <SafeAreaView style={{height:'100%', backgroundColor:'#16221C', paddingHorizontal:16}}>
      <View className={`${Platform.OS=== 'android' ? 'mt-20': undefined}`}>
        <Text className="text-center font-pbold text-3xl text-white-text">Community</Text>
      </View>
      <Text className={`mt-5 text-xs text-white-text italic ${Platform.OS==='ios' ? 'px-4' : undefined}`}>
        Showing Posts from farmers in {state}
      </Text>

      {loading ? (
        <Text className={`text-center text-white-text mt-5`}>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: Platform.OS==='ios'? 16 : 0 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
        />
      )}

      {/* Add Post Button */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-white-text flex-row rounded-full justify-center items-center pl-4 border-2 border-gray-600"
        activeOpacity={0.7}
        onPress={() => router.push('/addPost')}
      >
        <Text className="font-pregular">Add Post</Text>
        <View className="bg-white w-16 h-16 rounded-full flex justify-center items-center ml-2">
          <Text className="text-black text-6xl mt-2">+</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Community;
