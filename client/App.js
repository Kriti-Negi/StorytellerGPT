import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import Message from './components/Message';

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [submittedState, setSubmittedState] = useState(0);
  //0 be not sent request yet, 1 is request sent waiting on backend, 2 request is given by backend

  function change(text){
    setUserInput(text)  
  }
  useEffect(() => {
    getAIReponse(["START STORY"])
  }, [])

  async function getAIReponse(text){
    if(text == ""){
      text = "asdf"
    }

    fetch('http://127.0.0.1:5000/response/' + text).then(res => res.json()).then(data => {
      console.log(data.text);
      setMessages([
        ...messages,
        {
          text: text,
          from: "user"
        },
        {
          text: data.text,
          from: "ai"
        }
      ])
      console.log(messages);
      console.log(data.text);
    });
    
  }

  function submitRequest(){
      setMessages([
        ...messages,
        {
          text: userInput,
          from: "user"
        }
      ])
      var tempInput = userInput;
      setUserInput("");
      setSubmittedState(1);
      getAIReponse(tempInput);
      setSubmittedState(0);
  }
//{messages.map(value => {<Message messageText = {value}/>})}
  return (
    <SafeAreaView style = {styles.background}>
      <ScrollView>
        <View style = {styles.spacerStatusBar}></View>
        <View style = {styles.container}>
          <Text style = {styles.titleText}>StoryTellerGPT</Text>

          {messages.map((value, index) => <Message messageText = {value.text} from = {value.from} key = {index}/>)}
          
          <TextInput 
            style = {styles.input}
            onChangeText={newText => change(newText)}
            placeholder="What should happen next?"
            value = {userInput}
            onChange = {change}
            onSubmitEditing = {() => submitRequest()}
            editable={submittedState == 1? false: true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = new StyleSheet.create({
  background: {
    backgroundColor: '#f0f0f0',
    flex:1
  },
  spacerStatusBar: {
    marginTop:30,
    backgroundColor: '#f0f0f0'
  },
  container: {
    backgroundColor: '#f0f0f0',
    fontSize: 30,
    marginLeft: 30,
    marginRight: 30
  },
  titleText: {
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 20,
    fontWeight: '700'
  },
  input: {
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fc5185',
    color: "#fff",
    borderRadius: 8,
    marginBottom: 50
  }
});