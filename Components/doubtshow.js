import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { databases, doubtid } from '../lib/appwrite';

const DoubtShow = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments('6683ffe200263fc0e5d2', doubtid);
        setEvents(response.documents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSolveDoubt = (doubt) => {
    navigation.navigate('Solve', { doubt });
  };

  const handleSeeSolvedSolutions = (doubt) => {
    const { usn, desc, random, photo } = doubt;
    navigation.navigate('Solution', { usn, desc, random, photo });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {events.length === 0 ? (
        <Text>No Doubts available</Text>
      ) : (
        events.map(event => (
          <View key={event.$id} style={styles.eventCard}>
            <Text style={styles.eventText}>USN: {event.usn}</Text>
            <Text style={styles.eventText}>Description: {event.desc}</Text>
            {event.photo && <Image source={{ uri: event.photo }} style={styles.eventImage} />}
            {event.url && (
              <Text
                style={styles.eventText}
                onPress={() => Linking.openURL(event.url)}
              >
                URL: {event.url}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleSolveDoubt(event)}>
                <Text style={styles.buttonText}>Solve This</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleSeeSolvedSolutions(event)}>
                <Text style={styles.buttonText}>Solution</Text>
              </TouchableOpacity>
            </View>
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
    color: '#fff',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DoubtShow;
