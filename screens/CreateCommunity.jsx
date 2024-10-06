import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { databases, databaseId } from '../lib/appwrite';

const communityId = '668ac409002650832ec1';

const CreateCommunity = ({ navigation }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [desc, setDesc] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [leaderUsn, setLeaderUsn] = useState('');

  const handleCreateCommunity = async () => {
    try {
      const document = await databases.createDocument(databaseId, communityId, 'unique()', {
        name,
        goal,
        desc,
        eligibility,
        leaderusn: leaderUsn,
      });
      alert('Community created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Community</Text>
      <TextInput
        style={styles.input}
        placeholder="Community Name"
        placeholderTextColor="#fff"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputsd}
        placeholder="Community Goal"
        placeholderTextColor="#fff"
        value={goal}
        onChangeText={setGoal}
        multiline={true}
        numberOfLines={2}
      />
      <TextInput
        style={styles.inputsd}
        placeholder="Community Description"
        placeholderTextColor="#fff"
        value={desc}
        onChangeText={setDesc}
        multiline={true}
        numberOfLines={2}
      />
      <TextInput
        style={styles.inputsd}
        placeholder="Community Eligibility"
        placeholderTextColor="#fff"
        value={eligibility}
        onChangeText={setEligibility}
        multiline={true}
        numberOfLines={2}
      />
      <TextInput
        style={styles.input}
        placeholder="Community Leader USN"
        placeholderTextColor="#fff"
        value={leaderUsn}
        onChangeText={setLeaderUsn}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateCommunity}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0a3866',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#fff',
    borderRadius: 5,
  },
  inputsd: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#fff',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateCommunity;
