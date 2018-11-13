import React from 'react'
import { Alert, AsyncStorage, Button, Text, TextInput, View } from 'react-native'

export default class NameSaver extends React.Component {
  constructor(props) {
    super(props);
    this.saveName = this.saveName.bind(this);
    this.updateCounter = this.updateCounter.bind(this);
    this.state = {
      loaded: false,
      name: '',
      savedName: '',
      counter: 0
    }
  }
  componentDidMount() {
    this.loadData();
  }
  displayName() {
    return (
      <View>
        <Text>Welcome, { this.state.savedName }</Text>
        <Button title="Counter" onPress={this.updateCounter}>Count</Button>
        <Text>{ this.state.counter } Counted</Text>
      </View>
    )
  }
  async loadCount() {
    return AsyncStorage.getItem('count')
                       .then(s => s)
                       .catch(e => Alert.alert('No Count', 'Could not load a count'));
  }
  async loadName() {
    return AsyncStorage.getItem('username')
                       .then(s => s)
                       .catch(e => Alert.alert('No Username', 'Could not load a username'));
  }
  async loadData() {
    const username = await this.loadName();
    const count = await this.loadCount();
    this.setState({
      loaded: true,
      savedName: username === null ? '' : username,
      counter: count === null ? 0 : parseInt(count)
    });
  }
  requestName() {
    return (
      <View style={{ width: '100%' }}>
        <Text>Enter your name</Text>
        <TextInput placeholder="Name" onChangeText={ name => this.setState({name})}/>
        <Button title="Save Name" onPress={this.saveName}>Save</Button>
      </View>
    )
  }
  async saveCount(newCount) {
    await AsyncStorage.setItem('count', newCount.toString())
                      .catch(e => Alert.alert('Error Saving Count', 'Could not save the new count!'));
  }
  saveName() {
    const current = this.state.name;

    this.setState({
      savedName: current
    });

    this.saveNameValue(current);
    
  }
  async saveNameValue(val) {
    await AsyncStorage.setItem('username', val)
                      .catch(e => {
                        console.log(e);
                        Alert.alert('Error', 'Failed to save name!');
                      });
  }
  updateCounter() {
    const newCount = this.state.counter + 1;

    this.setState({
      counter: newCount
    });

    this.saveCount(newCount);
  }
  render() {
    return (
      <View>
        {
          !this.state.loaded &&
          <Text>Loading...</Text>
        }
        {
          this.state.loaded &&
          this.state.savedName === '' && this.requestName()
        }
        { 
          this.state.loaded &&
          this.state.savedName !== '' && this.displayName()
        }
      </View>
    )
  }
};