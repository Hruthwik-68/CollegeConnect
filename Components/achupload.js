import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { account, storage, bucket2id, databases, achievementid } from '../lib/appwrite';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

export default function AchuUpload() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    try {
      // Ensure user is authenticated
      let user = null;
      try {
        user = await account.get();
      } catch (error) {
        // If user is not authenticated, create an anonymous session
        if (error.code === 401) {
          await account.createAnonymousSession();
          user = await account.get();
        } else {
          throw error;
        }
      }

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

      const response = await fetch(`${storage.client.config.endpoint}/storage/buckets/${bucket2id}/files`, {
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
        const photoUrl = `${storage.client.config.endpoint}/storage/buckets/${bucket2id}/files/${data.$id}/view?project=${storage.client.config.project}`;

        const eventRecord = await databases.createDocument('6683ffe200263fc0e5d2', achievementid, 'unique()', {
          name,
          desc,
          photo: photoUrl,
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
      {!showForm && (
        <TouchableOpacity onPress={() => setShowForm(true)}>
          <Ionicons name="cloud-upload-outline" size={50} color="black" />
        </TouchableOpacity>
      )}
      {showForm && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          <TouchableOpacity style={styles.blackButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image from camera roll</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {image && (
            <TouchableOpacity style={styles.blackButton} onPress={uploadImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingLeft: 8,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  blackButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
