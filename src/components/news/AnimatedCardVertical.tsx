import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AnimatedCardVerticalProps } from '../../types/newsScreen';
import styles from '../../css/news/ClimateNewsScreen.styles';

const THEME_GREEN = '#43A047';

const AnimatedCardVertical = ({ item, index, onPress, bookmarked, onBookmark }: AnimatedCardVerticalProps) => {
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
        styles.cardVertical,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
        <Image source={{ uri: item.urlToImage }} style={styles.cardImageVertical} />
        <View style={styles.cardContentVertical}>
          <Text style={styles.cardTitleVertical}>{item.title}</Text>
          <Text style={styles.cardSubtitleVertical}>{item.source.name} • {item.publishedAt?.slice(0, 10)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookmarkBtn} onPress={() => item.id && onBookmark(item.id)}>
        <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? THEME_GREEN : '#bbb'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedCardVertical;
