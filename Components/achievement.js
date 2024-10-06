import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { databases, achievementid } from '../lib/appwrite';

const Achievement = () => {
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState([]);

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

  const handleLike = async (eventId) => {
    try {
      // Check if the event has already been liked by the user
      if (!likedEvents.includes(eventId)) {
        // Update local state to increment likes
        const eventIndex = events.findIndex(event => event.$id === eventId);
        if (eventIndex !== -1) {
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = {
            ...updatedEvents[eventIndex],
            likes: updatedEvents[eventIndex].likes ? updatedEvents[eventIndex].likes + 1 : 1
          };
          setEvents(updatedEvents);
          // Add the event to likedEvents
          setLikedEvents([...likedEvents, eventId]);

          // Update likes in the database
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
      {events.length === 0 ? (
        <Text>No events available</Text>
      ) : (
        events.map(event => (
          <View key={event.$id} style={styles.eventCard}>
            <Text style={styles.eventText}>Name: {event.name}</Text>
            <Text style={styles.eventText}>desc: {event.desc}</Text>
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
                style={styles.eventText}
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
    padding: 10,
    alignItems: 'center',
    backgroundColor:'#0a3866'
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
    elevation: 30,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
    color:'#fff'
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default Achievement;
