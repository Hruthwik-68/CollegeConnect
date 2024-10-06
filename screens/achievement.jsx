import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Achievement from '../Components/achievement';

const AchievementDisplay = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Achievement</Text>
      <Achievement />
    </View>
  );
};

const styles = StyleSheet.create({
 
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Changed to white for better contrast on dark background
    textAlign: 'center', // Center align the heading
    paddingVertical: 10, // Added padding for better spacing
    width: '100%', // Ensure the heading spans the width of the container
    backgroundColor: '#0a3866', // Background color to match container, or adjust as needed
  },
});

export default AchievementDisplay;
