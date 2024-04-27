import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons, images } from "../constants";
import { Video, ResizeMode } from "expo-av";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="h-[46px] w-[46px] rounded-lg border-2 border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="w-full h-fill rounded-lg"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white text-sm font-psemibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 text-sm font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
        source={{ uri: video }}
        className="w-full h-60 rounded-[35px] mt-3"
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if(status.didJustFinish) {
            setPlay(false);
          }
        }}
      />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="h-12 w-12 absolute"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
