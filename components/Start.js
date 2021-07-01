import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    // sets initial state for user name and background color
    this.state = {
      name: "",
      backgroundColor: '#fff'

    };
  }
  // renders the start view with name entry field and background color selector
  render() {
    return (
      <View style={styles.container} >
        <ImageBackground source={require('../assets/Background-Image.png')} style={styles.backgroundImage}>
          <Text style={styles.title}>CHAT.APP</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your name'
            />
            <View style={styles.backgroundSelector}>
              <Text style={styles.selectorText}>
                Choose Background Color:
              </Text>
              <View style={styles.colorButtons}>
                <TouchableOpacity
                onPress={() => this.setState({ backgroundColor: '#090C08' })}
                style={styles.color1}
                />
                <TouchableOpacity
                onPress={() => this.setState({ backgroundColor: '#474056' })}
                style={styles.color2}
                />
                <TouchableOpacity
                onPress={() => this.setState({ backgroundColor: '#8A95A5' })}
                style={styles.color3}
                />
                <TouchableOpacity
                onPress={() => this.setState({ backgroundColor: '#B9C6AE' })}
                style={styles.color4}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => 
                this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.backgroundColor })
              }>
                <Text style={styles.startButtonText}>Start Chatting</Text>
                </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: "cover",
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    flex: 0.44, 
    width: '88%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    bottom: 10,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    top: 60,
    height: 50,
    flex: 0.5
  },
  textInput: {
    width: '88%',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    height: 60, 
    borderColor: 'gray', 
    borderWidth: 1, 
    padding: 5,
    top: 5,
  },
  startButton: {
    width: '88%',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
    textAlign: 'center',
    padding: 15,
    bottom: 5,
  },
  backgroundSelector: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', 
    bottom: 5

  },
  selectorText: {
    textAlign: 'left',
    padding: 15,

  },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
