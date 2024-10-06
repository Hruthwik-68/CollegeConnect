import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { databases, databaseId } from '../lib/appwrite';

const communityMembersId = '668ac6be000e68b83ac2';
const communitiesCollectionId = '668ac409002650832ec1';

const JoinCommunity = ({ route }) => {
  const { communityId, communityName } = route.params;
  const [usn, setUsn] = useState('');
  const [desc, setDesc] = useState('');
  const [loadedCommunityName, setLoadedCommunityName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await databases.getDocument(databaseId, communitiesCollectionId, communityId);
        if (response) {
          setLoadedCommunityName(response.name);
        }
      } catch (error) {
        console.error('Error fetching community details:', error);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  const handleJoin = async () => {
    try {
      await databases.createDocument(databaseId, communityMembersId, 'unique()', {
        communityid: communityId,
        usn,
        desc,
        status: false,
        communityname: loadedCommunityName, // Use loadedCommunityName to store community name
      });
      alert('Joined community successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join Community</Text>
      <Text style={styles.label}>Community Name: {loadedCommunityName}</Text>
      <TextInput
        style={styles.input}
        placeholder="USN"
        value={usn}
        onChangeText={setUsn}
      />
      <TextInput
        style={styles.inputd}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        multiline={true}
        numberOfLines={2}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a3866', // Matching background color from previous code
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  inputd: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default JoinCommunity;
