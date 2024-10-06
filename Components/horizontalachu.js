import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, FlatList, Animated, Easing } from 'react-native';
import { databases, achievementid } from '../lib/appwrite';

const HorseAchu = () => {
  const [events, setEvents] = useState([]);
  const flatListRef = useRef(null);
  const scrollIndex = useRef(0);
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments('6683ffe200263fc0e5d2', achievementid);
        setEvents(response.documents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    animateBorder();
  }, []);

  const animateBorder = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };



  const scrollToNext = () => {
    if (events.length === 0) return;
    scrollIndex.current = (scrollIndex.current + 1) % events.length;
    flatListRef.current.scrollToIndex({ index: scrollIndex.current, animated: true });
  };

  const scrollToPrev = () => {
    if (events.length === 0) return;
    scrollIndex.current = (scrollIndex.current - 1 + events.length) % events.length;
    flatListRef.current.scrollToIndex({ index: scrollIndex.current, animated: true });
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.eventCard]}>
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.eventImage} />
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/cccc.png')} style={styles.logo} />

      <FlatList
        ref={flatListRef}
        data={events}
        renderItem={renderItem}
        horizontal
        keyExtractor={item => item.$id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  flatList: {
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 125,
    left: 120,
    width: 90,
    height: 60,
},
  eventCard: {
    width: 300,
    padding: 0,
    marginHorizontal: 10,
    backgroundColor: 'transparent',
    borderRadius: 15,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginTop: -65,
    borderWidth: 4, // Width of the neon border
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default HorseAchu;
