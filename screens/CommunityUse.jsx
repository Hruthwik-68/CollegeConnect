import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { databases } from '../lib/appwrite';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

const CommunityUse = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { communityId, communityName } = route.params;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments('6683ffe200263fc0e5d2', '668ace3b0016921995d4');
        setEvents(response.documents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleUploadProgress = () => {
    navigation.navigate('UploadProgress', { communityId, communityName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Community</Text>
        <TouchableOpacity onPress={handleUploadProgress} style={styles.iconButton}>
          <Icon name="cloud-upload" size={30} color="#0A3866" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.communityName}>{communityName}</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No events available</Text>
        ) : (
          events.map(event => (
            <View key={event.$id} style={styles.eventCard}>
              <Text style={styles.eventText}>Community Name: {event.communityname}</Text>
              <Text style={styles.eventText}>Community ID: {event.communityid}</Text>
              <Text style={styles.eventText}>USN: {event.usn}</Text>
              <Text style={styles.eventText}>Name: {event.name}</Text>
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#0A3866',
    padding: 10,
    borderRadius: 10,
    width:'60%',
    paddingLeft:20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0A3866',
  },
  content: {
    flexGrow: 1,
  },
  eventCard: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  noEventsText: {
    fontSize: 16,
    color: '#333333',
  },
  iconButton: {
    padding: 10,
    marginLeft:100
  },
});

export default CommunityUse;
