import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


export default class Chat extends React.Component {

  // renders the chat view
  render() {
    // gets the user name and preferred background color from props
    let name = this.props.route.params.name;
    let backgroundColor = this.props.route.params.backgroundColor;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor }}>
        <Text>Hello {name}!</Text>
      </View>
    );
  }
}

