import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Oops = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>You are not authorized</Text>
      <Text style={styles.message}>Please wait for some time</Text>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Try Again Pressed')}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0A3866',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Oops;
