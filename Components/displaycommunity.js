import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { databases, databaseId } from '../lib/appwrite';

const communityId = '668ac409002650832ec1';

const DisplayCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await databases.listDocuments(databaseId, communityId);
        setCommunities(response.documents);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleJoinCommunity = (communityId, communityName) => {
    navigation.navigate('JoinCommunity', { communityId, communityName });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {communities.length === 0 ? (
        <Text>No communities available</Text>
      ) : (
        communities.map(community => (
          <View key={community.$id} style={styles.card}>
            <Text style={styles.title}>{community.name}</Text>
            <Text style={styles.text}>Goal: {community.goal}</Text>
            <Text style={styles.text}>Description: {community.desc}</Text>
            <Text style={styles.text}>Eligibility: {community.eligibility}</Text>
            <Text style={styles.text}>Leader USN: {community.leaderusn}</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => handleJoinCommunity(community.$id, community.name)} 
            >
              <Text style={styles.buttonText}>Join Community</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: 'center',
    backgroundColor:'#0a3866',
  },
  card: {
    width: '100%',
    padding: 15,
    margin: 25,
    backgroundColor: '#0E4C8C',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff'
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color:'#fff'
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DisplayCommunity;
