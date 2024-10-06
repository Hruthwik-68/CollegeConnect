import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { account, storage, bucketId } from '../lib/appwrite';
import * as FileSystem from 'expo-file-system';

export default function Upload() {
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
            Alert.alert('Success', 'Image uploaded successfully');
            console.log('Uploaded Image:', data);
        } else {
            Alert.alert('Error', 'Image upload failed');
            console.error('Upload Error:', data);
        }
    } catch (error) {
        console.error('Upload Error:', error);
    }
};


  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
