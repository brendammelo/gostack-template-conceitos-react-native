import React, {useEffect, useState} from "react";

import api from './services/api.js'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  

  useEffect(() => {
    async function getRepos() {
      try {
        const {data} = await api.get("/repositories");
        setRepositories(data);
        // console.log(data, 'data inicial')
        
      } catch (error) {
        console.log(error)
        alert("Ocorreu um erro ao buscar os repos");
      }
    }
    getRepos();
  }, [])

  async function handleLikeRepository(id) {
   
    const response = await api.post(`/repositories/${id}/like`);
    const repository = response.data
    // console.log(repository, 'Resposta')

    const equalId = repositories.filter(item => item.id === id)

    const newRepos = [...repositories];

    const index = newRepos.indexOf(equalId[0]);

if (index !== -1) {
    newRepos[index] = repository;
    setRepositories(newRepos)
    // console.log(index, 'Entrou no IF')
    // console.log(repositories, 'repositorios')
    
}

  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      
      <SafeAreaView style={styles.container}>
        {repositories.map(({id, title, likes, techs}, index) => (
          <View key={String(index)} style={styles.repositoryContainer}>
          <Text style={styles.repository}>{title}</Text>
          
          <FlatList 
            style={styles.techsContainer}
            data={techs}
            keyExtractor={tech => tech}
            renderItem={({item}) => (
              <View style={styles.techsContainer}>
            <Text style={styles.tech}>
              {item}
            </Text>
    
          </View>
            )}
          />
         
          <View style={styles.likesContainer}>
            {likes === 1 ?
             (<Text
             style={styles.likeText}
             testID={`repository-likes-${id}`}
           >
             {`${likes} curtida`}
           </Text>)
           :
           (<Text
            style={styles.likeText}
            testID={`repository-likes-${id}`}
          >
            {`${likes} curtidas`}
          </Text>)
          }
           
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(id)}
            testID={`like-button-${id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
        </View>
        ))}
        
      </SafeAreaView>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
