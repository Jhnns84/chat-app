import React from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0
    }

    // this connects the app to firebase
    if (!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyBUrfwS-vk6gtTLNtdD7__vG67itTBGqBY",
        authDomain: "test-35658.firebaseapp.com",
        projectId: "test-35658",
        storageBucket: "test-35658.appspot.com",
        messagingSenderId: "171879031908",
        appId: "1:171879031908:web:9526eaa05684c2565bab71",
        measurementId: "G-QVQVT30MCX"
      });
      }


    this.referenceShoppinglistUser = null;
  };

  //  this creates a regular message and a system message as soon as the component is mounted
  componentDidMount() {

    // gets the username from props
    let name = this.props.route.params.name; 

    // this references the messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // this listens to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      // update state with active user data
      this.setState({
        uid: user.uid,
        messages: [],
      });
      // listen for collection changes
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  // this unsubscribes from the messages collection
  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    });
  }


    // this appends a new message to the message object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), 
    () => {
      this.addMessage();
      } 
    );
  }


  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'deeppink'
          }
        }}
      />
    )
  };

  render() {
    let name = this.props.route.params.name; 
    
    let backgroundColor = this.props.route.params.backgroundColor;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, backgroundColor: backgroundColor }}>
        {/* this renders the chat inteface */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* this ensures the keyboard and messages display correctly on android */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
    }
      </View>
    );
  };
}



