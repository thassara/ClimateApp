import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  NewsDetail: { news: any };
  // add other routes here if needed
};
const API_URL = 'http://localhost:5000/api/news'; // Change to your backend URL if needed

export default function NewsScreen() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;

  // Top 5 for horizontal scroll
  const topNews = news.slice(0, 5);
  // Rest for vertical scroll
  const restNews = news.slice(5);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Text style={styles.header}>Popular Climate News</Text>
      <FlatList
        data={topNews}
        keyExtractor={(_, i) => 'top-' + i}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.horizontalCard} onPress={() => navigation.navigate('NewsDetail', { news: item })}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.horizontalImage} />
            ) : (
              <View style={[styles.horizontalImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}><Text>No Image</Text></View>
            )}
            <Text numberOfLines={2} style={styles.horizontalTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.header}>Summarized News</Text>
      <FlatList
        data={restNews}
        keyExtractor={(_, i) => 'sum-' + i}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.verticalCard} onPress={() => navigation.navigate('NewsDetail', { news: item })}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.verticalImage} />
            ) : (
              <View style={[styles.verticalImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}><Text>No Image</Text></View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.verticalTitle}>{item.title}</Text>
              <Text style={styles.verticalSummary}>{item.summary}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginLeft: 16, marginVertical: 10, color: '#388E3C' },
  horizontalCard: { width: width * 0.7, marginRight: 16, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2 },
  horizontalImage: { width: '100%', height: 120, resizeMode: 'cover' },
  horizontalTitle: { fontSize: 16, fontWeight: 'bold', padding: 10 },
  verticalCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 12, marginBottom: 14, elevation: 1, overflow: 'hidden' },
  verticalImage: { width: 90, height: 90, borderTopLeftRadius: 16, borderBottomLeftRadius: 16, marginRight: 10 },
  verticalTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  verticalSummary: { fontSize: 13, color: '#444', marginTop: 4, marginBottom: 8 },
});
