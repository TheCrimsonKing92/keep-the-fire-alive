import React from 'react'
import { Text, TextInput, View } from 'react-native'
import MyButton from '../components/MyButton'

export default class NameSaver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      savedName: ''
    };

    this.saveName = this.saveName.bind(this);
  }
  displayName() {
    return (
      <View>
        <Text>Welcome, { this.props.name }</Text>
        <MyButton onPress={this.props.onCounter} text={'Count'}/>
        <Text>{ this.props.count } Counted</Text>
      </View>
    )
  }
  requestName() {
    return (
      <View style={{ width: '100%' }}>
        <Text>Enter your name</Text>
        <TextInput placeholder="Name" onChangeText={ name => this.setState({name})}/>
        <MyButton onPress={this.saveName} text={'Save'} />
      </View>
    )
  }

  saveName() {
    this.props.onNameSaved(this.state.name);
  }

  render() {
    return (
      <View>
        { this.props.name === '' ? this.requestName() : this.displayName() }
      </View>
    )
  }
};