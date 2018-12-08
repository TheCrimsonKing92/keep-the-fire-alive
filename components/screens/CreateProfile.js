import React from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import Toast from 'react-native-easy-toast'

export default class CreateProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.onPress = this.onPress.bind(this);
    this.toast = this.toast.bind(this);
  }

  onPress() {
    if (this.state.name.length === 0) {
      this.toast('Name cannot be empty');
      return;
    }

    if (this.state.name.trim().length === 0) {
      this.toast('Name cannot be blank');
      return;
    }

    this.props.onNameSaved(this.state.name);
  }

  toast(message) {
    this.refs.toast.show(message);
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={{fontSize: 18}}>Who's playing the game?</Text>
          <TextInput placeholder="Name" onChangeText={ name => this.setState({name})}/>
          <Button title="Save" onPress={this.onPress}>Save</Button>
        </View>
        <Toast ref="toast" position="top" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});