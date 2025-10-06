import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, Animated, RefreshControl, Modal, Pressable, Share, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';
import styles from '../../css/news/ClimateNewsScreen.styles';
import type { NewsItem } from '../../types/news';

import AnimatedCardHorizontal from '../../components/news/AnimatedCardHorizontal';
import AnimatedCardVertical from '../../components/news/AnimatedCardVertical';
import NewsSectionHeader from '../../components/news/NewsSectionHeader';
import type { IsBookmarked, HandleBookmark } from '../../types/newsScreen';

const THEME_GREEN = '#43A047';
const { width } = Dimensions.get('window');

const ClimateNewsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Use NEWS_API_URL from .env (set REACT_NATIVE_NEWS_API_URL in your .env file)
  const NEWS_URL = `${API_BASE_URL}/api/news?from=2025-09-23&to=2025-09-23`;

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(NEWS_URL);
      const json = await res.json();
      setNewsData(json.articles || []);
    } catch (e) {
      setNewsData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNews().finally(() => setRefreshing(false));
  }, []);

  // Filter news by search
  const filteredNewsData = newsData.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()));

  // Bookmark logic
  const isBookmarked: IsBookmarked = (id) => bookmarks.includes(id);
  const handleBookmark: HandleBookmark = (id) => {
    setBookmarks((prev) => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  interface OpenModalArg {
    id?: string;
    title: string;
    url: string;
    urlToImage?: string;
    source: { name: string };
    publishedAt?: string;
    summary?: string;
    description?: string;
    content?: string;
  }

  const openModal = (item: OpenModalArg) => {
    setSelectedNews(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

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
        <NewsSectionHeader title="Top News" />
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={THEME_GREEN} style={{ marginTop: 40 }} />
      ) : (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {filteredNewsData.map((item, idx) => (
            <AnimatedCardHorizontal
              key={item.url || idx}
              item={item}
              index={idx}
              onPress={openModal}
              bookmarked={isBookmarked(item.url)}
              onBookmark={() => handleBookmark(item.url)}
            />
          ))}
        </Animated.ScrollView>
      )}
      <View style={[styles.divider, { marginVertical: -8 }]} />
      <View style={[styles.verticalSectionBg, { marginTop: -8 }]}> 
        <View style={styles.verticalHeaderRow}>
          <NewsSectionHeader title="Latest Stories" />
          <View style={styles.badge}><Text style={styles.badgeText}>NEW</Text></View>
        </View>
        <ScrollView
          style={styles.verticalScroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredNewsData.map((item, idx) => (
            <AnimatedCardVertical
              key={item.url || idx}
              item={item}
              index={idx}
              onPress={openModal}
              bookmarked={isBookmarked(item.url)}
              onBookmark={() => handleBookmark(item.url)}
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
                {selectedNews.urlToImage ? (
                  <Image source={{ uri: selectedNews.urlToImage }} style={styles.modalImage} />
                ) : null}
                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                <Text style={styles.modalMeta}>{selectedNews.source?.name} • {selectedNews.publishedAt?.slice(0, 10)}</Text>
                <Text style={styles.modalBody}>{selectedNews.summary || selectedNews.description || selectedNews.content}</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalActionBtn} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={22} color={THEME_GREEN} />
                    <Text style={styles.modalActionText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalActionBtn} onPress={() => handleBookmark(selectedNews.url)}>
                    <Ionicons name={isBookmarked(selectedNews.url) ? 'bookmark' : 'bookmark-outline'} size={22} color={isBookmarked(selectedNews.url) ? THEME_GREEN : '#bbb'} />
                    <Text style={styles.modalActionText}>{isBookmarked(selectedNews.url) ? 'Bookmarked' : 'Bookmark'}</Text>
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

export default ClimateNewsScreen;
