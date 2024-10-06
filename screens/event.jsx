import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { databases, collectionId } from '../lib/appwrite';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments('6683ffe200263fc0e5d2', collectionId);
        setEvents(response.documents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Upcoming Events</Text>
      {events.length === 0 ? (
        <Text>No events available</Text>
      ) : (
        events.map(event => (
          <View key={event.$id} style={styles.eventCard}>
            <Text style={styles.eventText}>Name: {event.name}</Text>
            <Text style={styles.eventText}>USN: {event.desc}</Text>
            <Text style={styles.eventText}>College: {event.college}</Text>
            {event.photo && <Image source={{ uri: event.photo }} style={styles.eventImage} />}
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
    padding: 20,
    alignItems: 'center',
    backgroundColor:'#0A3866',
    color:'#fff'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#fff'

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
    color:'#fff',
    margin:5

  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Event;
