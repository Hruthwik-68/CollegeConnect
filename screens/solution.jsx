import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { databases, doubtsolveid, databaseId } from '../lib/appwrite';

const Solution = ({ route }) => {
  const { usn, desc, random, photo } = route.params;
  const [solutions, setSolutions] = useState([]);

  console.log('Random string passed from the previous screen:', random);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, doubtsolveid);

        response.documents.forEach(document => {
          console.log('Traversed random string:', document.random);
        });

        const foundSolutions = response.documents.filter(document => document.random === random);
        
        // Log all fetched solutions
        console.log('All fetched solutions:', response.documents);

        if (foundSolutions.length > 0) {
          setSolutions(foundSolutions);
        }
      } catch (error) {
        console.error('Error fetching solutions:', error);
      }
    };

    fetchSolutions();
  }, [random]);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Doubt Details</Text>
        <Text style={styles.text}>USN: {usn}</Text>
        <Text style={styles.text}>Description: {desc}</Text>
        {photo && <Image source={{ uri: photo }} style={styles.image} />}
      </View>

      {solutions.length > 0 ? (
        solutions.map(solution => (
          <View style={styles.card} key={solution.$id}>
            <Text style={styles.title}>Solution Details</Text>
            <Text style={styles.text}>Post USN: {solution.postusn}</Text>
            <Text style={styles.text}>USN: {solution.usn}</Text>
            <Text style={styles.text}>Description: {solution.desc}</Text>
          </View>
        ))
      ) : (
        <Text>No solutions found for this doubt.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0a3866',
  },
  container: {
    padding: 10,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 25,
    marginBottom: 15,
    backgroundColor: '#0E4C8C',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 30,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    margin: 10,
  },
});

export default Solution;
