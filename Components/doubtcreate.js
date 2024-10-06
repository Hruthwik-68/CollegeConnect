import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { account, storage, bucket2id, databases, doubtid } from '../lib/appwrite';
import * as FileSystem from 'expo-file-system';

// Function to generate a random string of 10 characters
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function DoubtCreate() {
  const [usn, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showInputs, setShowInputs] = useState(false); // State to track button press

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
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

        const randomString = generateRandomString();

        const eventRecord = await databases.createDocument('6683ffe200263fc0e5d2', doubtid, 'unique()', {
          usn,
          desc,
          photo: photoUrl,
          random: randomString,
        });

        Alert.alert('Success', 'Event created and image uploaded successfully');
        console.log('Uploaded Image:', data);
        console.log('Event Record:', eventRecord);

        // Reset state after successful upload
        setName('');
        setDesc('');
        setImage(null);
        setImageUri(null);
        setShowInputs(false);
      } else {
        Alert.alert('Error', 'Image upload failed');
        console.error('Upload Error:', data);
      }
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };

  const cancelUpload = () => {
    // Reset state to initial values
    setName('');
    setDesc('');
    setImage(null);
    setImageUri(null);
    setShowInputs(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showInputs && (
        <Button
          title="Have a doubt"
          onPress={() => setShowInputs(true)}
          color="black" // Set text color of the button to black
          style={{ backgroundColor: 'blue' }} // Set background color of the button to blue
        />
      )}

      {showInputs && (
        <>
          <TextInput
            style={styles.input}
            placeholder="USN"
            value={usn}
            onChangeText={setName}
          />
          <TextInput
            style={styles.inputdesc}
            placeholder="Description"
            value={desc}
           
            onChangeText={setDesc}
            multiline={true}
            numberOfLines={2}
          />
          <Button title="Pick an image from camera roll" onPress={pickImage} color="black" />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {image && <Button title="Upload Image" onPress={uploadImage} color="black" />}
          <View style={{ margin: 10 }}>
  <Button title="Cancel" onPress={cancelUpload} color="black" />
</View>       
 </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    margin:5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingLeft: 8,
    color:'#fff'
  },
  inputdesc:{
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingLeft: 8,
    color:'#fff'
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
