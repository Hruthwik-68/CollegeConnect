import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { databases, databaseId } from '../lib/appwrite';

const communityId = '668ac6be000e68b83ac2';

const MyCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const userUSN = await AsyncStorage.getItem('userUSN');
        const response = await databases.listDocuments(databaseId, communityId);

        // Filter communities where userUSN matches the usn
        const filteredCommunities = response.documents.filter(
          community => community.usn === userUSN
        );

        setCommunities(filteredCommunities);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleGoToCommunity = (communityId, communityName) => {
    navigation.navigate('CommunityUse', { communityId, communityName });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {communities.length === 0 ? (
        <Text style={styles.noCommunitiesText}>No communities available where you are the leader.</Text>
      ) : (
        communities.map(community => (
          <View key={community.$id} style={styles.card}>
            <Text style={styles.title}>{community.communityname}</Text>
            <Text style={styles.text}>Community Id: {community.communityid}</Text>
            <Text style={styles.text}>USN: {community.usn}</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleGoToCommunity(community.$id, community.communityname)}
            >
              <Text style={styles.buttonText}>Go to Community</Text>
            </TouchableOpacity>
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
    backgroundColor: '#0A3866', 
    height:'100%',// Set background color
  },
  card: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#0E4C8C', // Card background color
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Dark text color for title
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff', // Slightly lighter text color
  },
  noCommunitiesText: {
    color: '#ffffff', // White text for no communities message
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000', // Black background for button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff', // White text for button
    fontSize: 16,
  },
});

export default MyCommunity;
