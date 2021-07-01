import React from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  //  this creates a regular message and a system message as soon as the component is mounted
  componentDidMount() {
    let name = this.props.route.params.name; 
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi, it\'s Carol!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Carol',
            avatar: 'https://placeimg.com/140/140/people',
          },
         },
         {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }

  // this appends a new message to the message object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
