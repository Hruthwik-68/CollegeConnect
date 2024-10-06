import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, Databases } from 'appwrite';

const Solve = ({ route, navigation }) => {
  const { doubt } = route.params;
  const [isSolving, setIsSolving] = useState(false);
  const [solutionText, setSolutionText] = useState('');

  const handleSolve = () => {
    setIsSolving(true);
  };

  const handleSubmit = async () => {
    try {
        const userUSN = await AsyncStorage.getItem('userUSN');
        if (!userUSN) {
            Alert.alert('Error', 'User USN not found');
            return;
        }

        const client = new Client();
        client.setEndpoint('https://cloud.appwrite.io/v1').setProject('6683ffc0003389ad9824');

        const databases = new Databases(client);

        const data = {
            postusn: doubt.usn,
            usn: userUSN,
            desc: solutionText,
            random: doubt.random,
        };

        console.log('Data to be submitted:', data); // Log the data object to verify

        const response = await databases.createDocument(
            '6683ffe200263fc0e5d2', // Database ID
            '6689af2b0001f51c7dce', // Collection ID
            'unique()', // Document ID, you can use 'unique()' to auto-generate an ID
            data
        );

        console.log('Appwrite Response:', response); // Log the Appwrite response

        Alert.alert('Success', 'Solution submitted successfully');
        setSolutionText('');
        setIsSolving(false);
    } catch (error) {
        Alert.alert('Error', 'Failed to submit solution');
        console.error('Appwrite Error:', error);
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>USN: {doubt.usn}</Text>
      <Text style={styles.text}>Description: {doubt.desc}</Text>
      <Text style={styles.text}>Random: {doubt.random}</Text>
      {doubt.photo && <Image source={{ uri: doubt.photo }} style={styles.image} />}
      <TouchableOpacity style={[styles.button, styles.solveButton]} onPress={handleSolve}>
        <Text style={styles.buttonText}>Solve</Text>
      </TouchableOpacity>
      {isSolving && (
        <View style={styles.solutionContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your solution"
            placeholderTextColor="#ccc"
            value={solutionText}
            onChangeText={setSolutionText}
            multiline={true}
            numberOfLines={2}
          />
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={[styles.button, styles.goBackButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0A3866',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  solutionContainer: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  solveButton: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#000',
  },
  goBackButton: {
    marginTop: 20,
  },
});

export default Solve;
