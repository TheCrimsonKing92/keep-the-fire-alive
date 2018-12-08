import React from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default class CreateProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };
  }
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={{fontSize: 18}}>Who's playing the game?</Text>
          <TextInput placeholder="Name" onChangeText={ name => this.setState({name})}/>
          <Button title="Save" onPress={e => this.props.onNameSaved(this.state.name)}>Save</Button>
        </View>
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