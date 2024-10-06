import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { account, storage, bucketId, databases, collectionId } from '../lib/appwrite';
import * as FileSystem from 'expo-file-system';

export default function Event() {

  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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

  const validateURL = (string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(string);
  };

  const uploadImage = async () => {
    if (!validateURL(url)) {
      Alert.alert('Invalid URL', 'Please enter a valid URL.');
      return;
    }

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

        const eventRecord = await databases.createDocument('6683ffe200263fc0e5d2', collectionId, 'unique()', {
          
         
      
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
     
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
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
});
