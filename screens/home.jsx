import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { databases } from '../lib/appwrite'; // Assuming this imports Appwrite correctly
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import Modal from 'react-native-modal'; // Import Modal
import HorseAchu from '../Components/horizontalachu';
const Home = () => {
    const [usn, setUsn] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility
    const navigation = useNavigation();
    const [animation] = useState(new Animated.Value(0));
    const [buttonScale] = useState(new Animated.Value(1));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUsn = await AsyncStorage.getItem('userUSN');
                if (storedUsn) {
                    console.log('USN fetched from AsyncStorage:', storedUsn); // Debugging log
                    setUsn(storedUsn);

                    // Fetch user details based on USN
                    const userDetails = await fetchUserDetails(storedUsn);
                    if (userDetails) {
                        setName(userDetails.name);
                    }
                } else {
                    console.log('No USN found in AsyncStorage'); // Debugging log
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Floating animation
      
    }, []);

    const fetchUserDetails = async (usn) => {
        try {
            // Example: Query the database to fetch user details based on USN
            const query = await databases.listDocuments(
                '6683ffe200263fc0e5d2', // Database ID
                '6683fffc0029b4a67b78', // Collection ID
                [`equal("usn", "${usn}")`]
            );

            if (query.total > 0) {
                return query.documents[0]; // Assuming the first document has the user details
            }
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
        return null;
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userUSN');
            setUsn('');
            setName('');
            Alert.alert('Success', 'You have been logged out.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
            console.error('Error clearing AsyncStorage', error);
        }
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
        setShowMenu(false); // Hide menu after navigating
    };

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#00BFFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Logo at the top left */}

            {/* Display user info */}
            <View style={styles.userInfoContainer}>
                <Text style={styles.collegeText}>Dayananda Sagar Academy Of Technology And Management</Text>
                <Text style={styles.nameText}>Welcome  {name}</Text>
            </View>

            {/* Profile icon with dropdown menu */}
            <TouchableOpacity style={styles.profileContainer} onPress={() => setShowMenu(!showMenu)}>
                <Icon name="user" size={30} color="#000" />
            </TouchableOpacity>
            
            <Modal
                isVisible={showMenu}
                onBackdropPress={() => setShowMenu(false)}
                backdropOpacity={0.3}
                style={styles.modal}
            >
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
                        <Text style={styles.menuItemText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Text style={styles.menuItemText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
           
    <HorseAchu/>
   
            {/* Buttons container */}
            <View style={styles.buttonsContainer}>
            <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Event')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="calendar" size={30} color="#000" />
                        <Text style={styles.label}>Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Map')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="map" size={30} color="#000" />
                        <Text style={styles.label}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Doubt')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="info" size={30} color="#000" />
                        <Text style={styles.label}>Doubt</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Community')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="group" size={30} color="#000" />
                        {/* <Text style={styles.label}>Community</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MyCommunity')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="comments" size={30} color="#000" />
                        <Text style={styles.label}>My</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Achievement')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={styles.iconButton}
                    >
                        <Icon name="star" size={30} color="#000" />
                        <Text style={styles.label}>Award</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.buttonsRow}>
                 
                </View>
    <View style={styles.buttonsRow}>
    <AnimatedButton title="Joined Community" onPress={() => navigation.navigate('JoinedCommunity')} animation={animation} buttonScale={buttonScale} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
    </View>
            </View>

        
        </View>
    );
};

const AnimatedButton = ({ title, onPress, animation, buttonScale, handlePressIn, handlePressOut }) => {
    return (
        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: animation }, { scale: buttonScale }] }]}>
            <TouchableOpacity style={styles.button} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0A3866', // Light gray background
    },
    loadingContainer: {
        justifyContent: 'center',
    },
    label: {
        marginTop: 5,
        fontSize: 12,
        color: '#000', // Label color
    },
    userInfoContainer: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        position: 'absolute',
        top: 0,
        height: '30%',
        backgroundColor: '#1E90FF', // Blue background
        width: '110%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        // borderWidth:3,
        borderTopWidth:0,
        // borderColor:'#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 3, height: 12 },
        shadowRadius: 6,
        elevation: 155,
    },
    collegeText: {
        color: '#ccc', // Dark gray text
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        shadowColor: '#000000', // Shadow color
        shadowOffset: { width: 10, height: 2 }, // Shadow offset
        shadowOpacity: 0.9, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 3, // Elevation for Android shadow
        backgroundColor:'transparent',
        width:'100%',
        padding:10,
        borderWidth:0.1
    },
    
    col: {
        height: 100,
        width: 100,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    usnText: {
        fontSize: 16,
        color: '#333333', // Dark gray text
        marginBottom: 5,
        fontWeight: 'bold',

    },
    nameText: {
        fontSize: 16,
        color: '#000', // Dark gray text
        marginBottom: 10,
        fontWeight: 'bold',
        borderWidth:1,
        padding:5,
        width:'50%',
        textAlign:'center',
        borderRadius:10

    },
    descText: {
        fontSize: 14,
        color: '#666666', // Lighter gray text
        textAlign: 'center',
        marginBottom: 10,
    },
    profileContainer: {
        position: 'absolute',
        top: 125,
        right: 20,
        zIndex: 1,
        borderWidth: 1,
        borderColor: '#333333', // Dark gray border
        padding: 10,
        borderRadius: 15,
        height: 50,
    },
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 0,
        paddingTop: 50,
        paddingRight: 20,
    },
    menu: {
        backgroundColor: '#0A3866', // Orange background
        borderRadius: 5,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 20 },
        shadowOpacity: 5,
        shadowRadius: 2,
        elevation: 5,
    },
    menuItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#32CD32', // Green border
    },
    menuItemText: {
        color: '#FFFFFF',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '-75%',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#32CD32', // Green shadow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E90FF', // Orange border
    },
    buttonText: {
        color: '#000', // White text
        fontSize: 16,
        fontWeight:'900'
    },
    iconButton: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        shadowColor: '#fff', // Shadow color
        shadowOffset: { width: 0, height: 4 }, // Shadow offset
        shadowOpacity: 1, // Shadow opacity
        shadowRadius: 10, // Shadow radius
        elevation: 25, // Elevation for Android shadow
        margin:10
    },
});

export default Home;
