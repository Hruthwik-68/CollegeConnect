import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { client, databases, storage, bucketId } from '../lib/appwrite'; // Adjust import path as per your project structure

const Signup = () => {
    const [name, setName] = useState('');
    const [usn, setUsn] = useState('');
    const [email, setEmail] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [image, setImage] = useState(null);
    const [imageUri, setImageUri] = useState(null);

    const navigation = useNavigation();

    const checkUnique = async (field, value) => {
        const query = databases.listDocuments(
            '6683ffe200263fc0e5d2', // Database ID
            '6683fffc0029b4a67b78', // Collection ID
            [`equal("${field}", "${value}")`]
        );
        const result = await query;
        return result.total === 0;
    };

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

    const handleSignup = async () => {
        setError('');
        setSuccess('');

        // Check if an image has been selected
        if (!imageUri) {
            Alert.alert('Error', 'Please upload a profile picture.');
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
                // Image uploaded successfully, proceed with user creation
                const imageUrl = `${storage.client.config.endpoint}/storage/buckets/${bucketId}/files/${data.$id}/view?project=${storage.client.config.project}`;
                console.log('Image uploaded:', imageUrl);

                try {
                    const usnUnique = await checkUnique('usn', usn);
                    const emailUnique = await checkUnique('email', email);
                    const phonenoUnique = await checkUnique('phoneno', phoneno);

                    if (!usnUnique) {
                        setError('USN already exists');
                        return;
                    }
                    if (!emailUnique) {
                        setError('Email already exists');
                        return;
                    }
                    if (!phonenoUnique) {
                        setError('Phone number already exists');
                        return;
                    }

                    const userRecord = await databases.createDocument(
                        '6683ffe200263fc0e5d2', // Database ID
                        '6683fffc0029b4a67b78', // Collection ID
                        'unique()', // Document ID, you can use 'unique()' to auto-generate an ID
                        {
                            name,
                            usn,
                            email,
                            phoneno,
                            password,
                            imageUrl, // Ensure 'imageUrl' matches the field name in your Appwrite collection
                        }
                    );

                    setSuccess('User created successfully');
                    console.log('User created successfully:', userRecord);

                    // Navigate to the Login screen
                    navigation.navigate('Login');
                } catch (error) {
                    setError('Error creating user: ' + error.message);
                    console.error('Error creating user:', error);
                }
            } else {
                Alert.alert('Error', 'Image upload failed');
                console.error('Image upload failed:', data);
            }
        } catch (error) {
            console.error('Upload Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                required
                placeholderTextColor="#ffffff"
            />
            <TextInput
                style={styles.input}
                placeholder="USN"
                value={usn}
                onChangeText={setUsn}
                required
                placeholderTextColor="#ffffff"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                required
                placeholderTextColor="#ffffff"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneno}
                onChangeText={setPhoneno}
                keyboardType="phone-pad"
                required
                placeholderTextColor="#ffffff"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
                placeholderTextColor="#ffffff"
            />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick a profile picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonTextLogin}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#0A3866', // Blue background color
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: '#ffffff', // White text color
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    success: {
        color: 'green',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 12,
    },
    pickButton: {
        backgroundColor: 'black', // Black button color
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    signupButton: {
        backgroundColor: 'black', // Black button color
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: 'white', // White button color
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonTextLogin: {
        color: '#000',
        fontSize: 16,
        fontWeight:'900'
    },
});

export default Signup;
