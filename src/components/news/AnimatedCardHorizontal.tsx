import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AnimatedCardHorizontalProps } from '../../types/newsScreen';
import styles from '../../css/news/ClimateNewsScreen.styles';

const THEME_GREEN = '#43A047';

const AnimatedCardHorizontal = ({ item, index, onPress, bookmarked, onBookmark }: AnimatedCardHorizontalProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400 + index * 100,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.cardHorizontal,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
        <Image source={{ uri: item.urlToImage }} style={styles.cardImageHorizontal} />
        <View style={styles.cardContentHorizontal}>
          <Text style={styles.cardTitleHorizontal}>{item.title}</Text>
          <Text style={styles.cardSubtitleHorizontal}>{item.source.name} • {item.publishedAt?.slice(0, 10)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookmarkBtn} onPress={() => item.id && onBookmark(item.id)}>
        <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? THEME_GREEN : '#bbb'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedCardHorizontal;
