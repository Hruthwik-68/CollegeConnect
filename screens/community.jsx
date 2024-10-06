import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DisplayCommunity from '../Components/displaycommunity';
import { ScrollView } from 'react-native-gesture-handler';

const Community = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CreateCommunity')}
        >
          <Text style={styles.buttonText}>Create Community</Text>
        </TouchableOpacity>
      </View>
      <DisplayCommunity/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0a3866',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Community;
