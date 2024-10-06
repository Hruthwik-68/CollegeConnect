import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DoubtCreate from '../Components/doubtcreate';
import DoubtShow from '../Components/doubtshow';

const Doubt = () => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <DoubtCreate />
        <DoubtShow />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A3866', // Set background color of ScrollView to blue
  },
});

export default Doubt;
