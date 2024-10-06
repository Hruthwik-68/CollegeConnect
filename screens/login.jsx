import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { databases } from '../lib/appwrite'; // Correct import path
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [usn, setUsn] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigation = useNavigation();

    const handleLogin = async () => {
        setError('');

        try {
            // Query the database to find the user with the entered USN
            const query = await databases.listDocuments(
                '6683ffe200263fc0e5d2', // Database ID
                '6683fffc0029b4a67b78', // Collection ID
                [`equal("usn", "${usn}")`]
            );

            if (query.total === 0) {
                setError('USN not found');
                return;
            }

            const user = query.documents[0];
            
            if (user.password !== password) {
                setError('Incorrect password');
                return;
            }

            // Store the user's USN in AsyncStorage
            await AsyncStorage.setItem('userUSN', usn);
            
            // Navigate to Home or Oops screen based on user attribute
            if (user.oops) {
                navigation.navigate('Home');
            } else {
                navigation.navigate('Oops');
            }
        } catch (error) {
            setError('Error logging in: ' + error.message);
            console.error('Error logging in', error);
        }
    };

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
                placeholderTextColor="#ffffff"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
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
    loginButton: {
        backgroundColor: 'black', // Black button color
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
    signupButton: {
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    signupButtonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default Login;
