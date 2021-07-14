import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0, 
      image: null,
      location: null,
      isConnected: false, 
      user: {
        _id: '',
        name: '',
      }
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

      LogBox.ignoreAllLogs();//Ignore all log notifications
  };

  //  this creates a regular message and a system message as soon as the component is mounted
  componentDidMount() {

    // gets the username from props
    let name = this.props.route.params.name; 
    this.props.navigation.setOptions({ title: name });

    // this references the messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        //changes state to connected
        this.setState({ isConnected: true });
        // this listens to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          // update state with active user data
          this.setState({
            uid: user.uid,
            messages: [],
            isConnected: true,
            user: {
              _id: user.uid,
              name: name,
            }
          });
          // listen for collection changes
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        // changes state to disconnected
        this.setState({ isConnected: false });
        // this gets stored messages form asyncStorage
        this.getMessages();
      }
    });
  }

  // this unsubscribes from the messages collection
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  // this gets messages from asyncStorage  
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // this saves messages locally as they're sent
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // this deletes messages 
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // this adds new messages
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      uid: this.state.uid,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({ messages });
  };


    // this appends a new message to the message object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), 
    () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  // This sets the chat bubble color
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

  // this renders the message input only when a connection is given
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: Number(currentMessage.location.latitude),
              longitude: Number(currentMessage.location.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name; 
    
    let backgroundColor = this.props.route.params.backgroundColor;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, backgroundColor: backgroundColor }}>
        {/* this renders the chat inteface */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {/* this ensures the keyboard and messages display correctly on android */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
    }
      </View>
    );
  };
}



