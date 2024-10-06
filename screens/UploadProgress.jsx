import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { account, storage, bucketId, databases, databaseId } from '../lib/appwrite';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadProgress = () => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { communityId, communityName } = route.params; // Extracting communityId and communityName from route params

  useEffect(() => {
    const fetchUserUSN = async () => {
      try {
        const usnValue = await AsyncStorage.getItem('userUSN');
        if (usnValue) {
          setUsn(usnValue.trim()); // Set the user's USN from AsyncStorage
        }
      } catch (error) {
        console.error('Error fetching user USN from AsyncStorage:', error);
      }
    };

    fetchUserUSN();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateAndUploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    try {
      const fileUri = imageUri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const file = {
        uri: fileInfo.uri,
        name: fileInfo.uri.split('/').pop(),
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('fileId', 'unique()'); // Request Appwrite to generate a unique ID
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      const response = await fetch(`${storage.client.config.endpoint}/storage/buckets/${bucketId}/files`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': storage.client.config.project,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 201) {
        // Image uploaded successfully, now create the event record
        const photoUrl = `${storage.client.config.endpoint}/storage/buckets/${bucketId}/files/${data.$id}/view?project=${storage.client.config.project}`;

        const eventRecord = await databases.createDocument(
          databaseId, '668ace3b0016921995d4', 'unique()', {
            communityid: communityId,
            communityname: communityName, // Include communityName here
            usn: usn,
            desc: desc,
            photo: photoUrl,
            name: name,
          });

        Alert.alert('Success', 'Event created and image uploaded successfully');
        console.log('Uploaded Image:', data);
        console.log('Event Record:', eventRecord);
      } else {
        Alert.alert('Error', 'Image upload failed');
        console.error('Upload Error:', data);
      }
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Description"
          placeholderTextColor="#fff"
          value={desc}
          onChangeText={setDesc}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={validateAndUploadImage}>
          <Text style={styles.buttonText}>Upload Image and Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3866',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff',
  },
  inputs: {
    height: 80,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
  },
  button: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#000', // Dark background color
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16,
  },
});

export default UploadProgress;
