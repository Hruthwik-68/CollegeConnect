import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { databases } from '../lib/appwrite';
import AchievementProfile from '../Components/showprofileAchievement';
import AchuUpload from '../Components/achupload';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usn = await AsyncStorage.getItem('userUSN');
        if (!usn) {
          console.error('No USN found in AsyncStorage');
          return;
        }

        const response = await databases.listDocuments('6683ffe200263fc0e5d2', '6683fffc0029b4a67b78', [`equal("usn", "${usn}")`]);
        if (response.documents.length > 0) {
          const userData = response.documents[0];
          console.log('Name:', userData.name);
          console.log('USN:', userData.usn);
          console.log('Email:', userData.email);
          console.log('Phone Number:', userData.phoneno);
          console.log('Image URL:', userData.imageUrl); // Check if this is the correct field name
          setUserData(userData);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
            <AchuUpload />

      {userData.imageUrl && (
        <Image
          source={{ uri: userData.imageUrl }} // Ensure 'userData.imageUrl' is correctly referencing the image URL
          style={styles.image}
        />
      )}
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.detail}>USN: {userData.usn}</Text>
      <Text style={styles.detail}>Email: {userData.email}</Text>
      <Text style={styles.detail}>Phone Number: {userData.phoneno}</Text>
   
      <AchievementProfile />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0a3866',
    flexGrow: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default Profile;
