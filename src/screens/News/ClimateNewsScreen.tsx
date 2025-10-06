const THEME_GREEN = '#43A047';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Animated, RefreshControl, Modal, Pressable, Share, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const newsData = [
  {
    id: '1',
    title: 'Global Warming Hits New Highs',
    image: require('../../assets/images/News/climate1.jpeg'),
    source: 'BBC',
    date: '2025-10-01',
    content: 'Record-breaking temperatures have been observed globally...'
  },
  {
    id: '2',
    title: 'Oceans Are Rising',
    image: require('../../assets/images/News/climate2.jpeg'),
    source: 'CNN',
    date: '2025-09-28',
    content: 'Sea levels are rising at an unprecedented rate...'
  },
  {
    id: '3',
    title: 'Wildfires Spread Rapidly',
    image: require('../../assets/images/News/climate3.jpeg'),
    source: 'Reuters',
    date: '2025-09-25',
    content: 'Wildfires have spread across multiple continents...'
  },
];

const verticalNews = [
  {
    id: 'a',
    title: 'Renewable Energy Growth',
    image: require('../../assets/images/News/climate4.jpeg'),
  },
  {
    id: 'b',
    title: 'Climate Policy Updates',
    image: require('../../assets/images/News/climate5.jpeg'),
  },
    {
    id: 'c',
    title: 'Climate Policy Updates',
    image: require('../../assets/images/News/climate5.jpeg'),
  },
    {
    id: 'd',
    title: 'Climate Policy Updates',
    image: require('../../assets/images/News/climate5.jpeg'),
  },
];

const { width } = Dimensions.get('window');

type AnimatedCardHorizontalProps = {
  item: {
    id: string;
    title: string;
    image: any;
    source: string;
    date: string;
    content?: string;
  };
  index: number;
  onPress: (item: any) => void;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
};

const AnimatedCardHorizontal = ({ item, index, onPress, bookmarked, onBookmark }: AnimatedCardHorizontalProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
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
        <Image source={item.image} style={styles.cardImageHorizontal} />
        <View style={styles.cardContentHorizontal}>
          <Text style={styles.cardTitleHorizontal}>{item.title}</Text>
          <Text style={styles.cardSubtitleHorizontal}>{item.source} • {item.date}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookmarkBtn} onPress={() => onBookmark(item.id)}>
  <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? THEME_GREEN : '#bbb'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

type AnimatedCardVerticalProps = {
  item: {
    id: string;
    title: string;
    image: any;
    source?: string;
    date?: string;
    content?: string;
  };
  index: number;
  onPress: (item: any) => void;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
};

const AnimatedCardVertical = ({ item, index, onPress, bookmarked, onBookmark }: AnimatedCardVerticalProps) => {
  const anim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
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
        index === 0 && styles.cardVerticalFirst,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        },
      ]}
    >
      <TouchableOpacity style={{flex:1, flexDirection:'row'}} activeOpacity={0.8} onPress={() => onPress(item)}>
        <Image source={item.image} style={styles.cardImageVertical} />
        <View style={styles.cardContentVertical}>
          <Text style={styles.cardTitleVertical}>{item.title}</Text>
          <Text style={styles.cardSubtitleVertical}>{item.source} • {item.date}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookmarkBtn} onPress={() => onBookmark(item.id)}>
  <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? THEME_GREEN : '#bbb'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ClimateNewsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Filter news by search
  const filteredNewsData = newsData.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  const filteredVerticalNews = verticalNews.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  // Bookmark logic
interface IsBookmarked {
    (id: string): boolean;
}

const isBookmarked: IsBookmarked = (id) => bookmarks.includes(id);
interface HandleBookmark {
    (id: string): void;
}

const handleBookmark: HandleBookmark = (id) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
};

  // Modal logic
interface NewsItem {
    id: string;
    title: string;
    image: any;
    source?: string;
    date?: string;
    content?: string;
}

const openModal = (item: NewsItem) => {
    setSelectedNews(item);
    setModalVisible(true);
};
  const closeModal = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  // Share logic
  const handleShare = async () => {
    if (!selectedNews) return;
    try {
      await Share.share({
        message: `${selectedNews.title}\n${selectedNews.content}`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Climate News</Text>
        <TouchableOpacity style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={26} color={THEME_GREEN} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search news..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />
      <View style={styles.topNewsRow}>
        <Text style={styles.topNewsTitle}>Top News</Text>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {filteredNewsData.map((item, idx) => (
          <AnimatedCardHorizontal
            key={item.id}
            item={item}
            index={idx}
            onPress={openModal}
            bookmarked={isBookmarked(item.id)}
            onBookmark={handleBookmark}
          />
        ))}
      </Animated.ScrollView>
      <View style={[styles.divider, { marginVertical: -8 }]} />
      <View style={[styles.verticalSectionBg, { marginTop: -8 }]}> 
        <View style={styles.verticalHeaderRow}>
          <Text style={styles.verticalSectionHeader}>Latest Stories</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>NEW</Text></View>
        </View>
        <ScrollView
          style={styles.verticalScroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredVerticalNews.map((item, idx) => (
            <AnimatedCardVertical
              key={item.id}
              item={item}
              index={idx}
              onPress={openModal}
              bookmarked={isBookmarked(item.id)}
              onBookmark={handleBookmark}
            />
          ))}
        </ScrollView>
      </View>
      {/* News Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedNews && (
              <>
                <Image source={selectedNews.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                <Text style={styles.modalMeta}>{selectedNews.source} • {selectedNews.date}</Text>
                <Text style={styles.modalBody}>{selectedNews.content}</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalActionBtn} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={22} color={THEME_GREEN} />
                    <Text style={styles.modalActionText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalActionBtn} onPress={() => handleBookmark(selectedNews.id)}>
                    <Ionicons name={isBookmarked(selectedNews.id) ? 'bookmark' : 'bookmark-outline'} size={22} color={isBookmarked(selectedNews.id) ? THEME_GREEN : '#bbb'} />
                    <Text style={styles.modalActionText}>{isBookmarked(selectedNews.id) ? 'Bookmarked' : 'Bookmark'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalActionBtn} onPress={closeModal}>
                    <MaterialIcons name="close" size={22} color="#222" />
                    <Text style={styles.modalActionText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 14,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalMeta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalActionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  modalActionText: {
    fontSize: 13,
  color: THEME_GREEN,
    marginTop: 2,
  },
  topNewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 0,
    marginTop: 0,
  },
  seeAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 16,
    marginVertical: 0,
    borderRadius: 1,
  },
  verticalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 1,
  },
  topNewsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME_GREEN,
    backgroundColor: '#E8F5E9', // light green
    marginLeft: 16,
    marginBottom: 0,
    marginTop: 0,
    letterSpacing: 0.2,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 0,
  },
  bellButton: {
    padding: 6,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 0,
    marginBottom: 0,
  },
  horizontalScroll: {
    minHeight: 240,
    maxHeight: 260,
    marginBottom: 18,
    paddingLeft: 16,
    marginTop: 0,
  },
  cardHorizontal: {
    width: width * 0.7,
    marginRight: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
    minHeight: 150,
    maxHeight: 200,
  },
  cardImageHorizontal: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  cardContentHorizontal: {
    padding: 10,
  },
  cardTitleHorizontal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  cardSubtitleHorizontal: {
    fontSize: 14,
    color: '#888',
  },
  verticalSectionBg: {
    backgroundColor: '#F6F7F9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 6,
    flex: 1,
    marginTop: 0,
  },
  verticalSectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME_GREEN,
    backgroundColor: '#E8F5E9', // light green
    marginLeft: 16,
    marginBottom: 10,
    letterSpacing: 0.2,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  verticalScroll: {
    flex: 1,
    marginHorizontal: 0,
    paddingHorizontal: 16,
  },
  cardVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 16,
    overflow: 'hidden',
    minHeight: 110,
  },
  cardVerticalFirst: {
    marginTop: 2,
  },
  cardImageVertical: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 18,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
  },
  cardContentVertical: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitleVertical: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 3,
  },
  cardSubtitleVertical: {
    fontSize: 13,
    color: '#888',
  },
});

export default ClimateNewsScreen;
