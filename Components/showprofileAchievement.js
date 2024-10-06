import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { databases, achievementid } from '../lib/appwrite';

const AchievementProfile = () => {
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);
  const [usn, setUsn] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const storedUsn = await AsyncStorage.getItem('userUSN'); // Retrieve USN from AsyncStorage
        if (storedUsn) {
          console.log('Stored USN:', storedUsn); // Log the stored USN
          setUsn(storedUsn); // Set the retrieved USN to state
          const response = await databases.listDocuments('6683ffe200263fc0e5d2', achievementid);
          console.log('Fetched achievements:', response.documents); // Log the fetched achievements
          const filteredEvents = response.documents.filter(event => event.name === storedUsn); // Filter events based on matching name to USN
          setEvents(filteredEvents);

          // Log all achievement names
          console.log('Achievement names:');
          filteredEvents.forEach(event => {
            console.log(event.name);
          });
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  const handleLike = async (eventId) => {
    try {
      if (!likedEvents.includes(eventId)) {
        const eventIndex = events.findIndex(event => event.$id === eventId);
        if (eventIndex !== -1) {
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = {
            ...updatedEvents[eventIndex],
            likes: updatedEvents[eventIndex].likes ? updatedEvents[eventIndex].likes + 1 : 1
          };
          setEvents(updatedEvents);
          setLikedEvents([...likedEvents, eventId]);

          await databases.updateDocument('6683ffe200263fc0e5d2', achievementid, eventId, {
            likes: updatedEvents[eventIndex].likes
          });
        }
      } else {
        console.log('Event already liked by the user.');
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Achievements</Text>
      {events.length === 0 ? (
        <Text style={styles.eventText}>No achievements available</Text>
      ) : (
        events.map(event => (
          <View key={event.$id} style={styles.eventCard}>
            <Text style={styles.eventText}>Name: {event.name}</Text>
            <Text style={styles.eventText}>Description: {event.desc}</Text>
            {event.photo && (
              <TouchableOpacity onPress={() => handleLike(event.$id)} disabled={likedEvents.includes(event.$id)}>
                <Image source={{ uri: event.photo }} style={styles.eventImage} />
              </TouchableOpacity>
            )}
            {event.likes !== undefined && (
              <Text style={styles.eventText}>Likes: {event.likes}</Text>
            )}
            {event.url && (
              <Text
                style={styles.eventLink}
                onPress={() => Linking.openURL(event.url)}
              >
                URL: {event.url}
              </Text>
            )}
            <Text style={styles.eventText}>Extra: {event.extra}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: 'center',
    borderWidth:1,
    borderColor:'black',
    paddingTop:20,
    marginTop:50

  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  eventCard: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#0E4C8C',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  eventLink: {
    fontSize: 16,
    marginBottom: 5,
    color: '#00FFFF', // Light blue for the URL link
    textDecorationLine: 'underline',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default AchievementProfile;
