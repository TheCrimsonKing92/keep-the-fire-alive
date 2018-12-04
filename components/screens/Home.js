import React from 'react'
import { Alert, AsyncStorage, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation'
import Banner from '../Banner';
import Footer from '../Footer';
import NameSaver from '../NameSaver'
import TheFire from '../TheFire';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      name: '',
      counter: 0
    }

    this.loadCount = this.loadCount.bind(this);
    this.loadName = this.loadName.bind(this);
    this.loading = this.loading.bind(this);
    this.normal = this.normal.bind(this);
    this.onCounterPressed = this.onCounterPressed.bind(this);
    this.onNameSaved = this.onNameSaved.bind(this);
    this.onPressFire = this.onPressFire.bind(this);
    this.saveCount = this.saveCount.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.getData();
  }

  async getData() {
    console.log('Getting data');
    const count = await this.loadCount();
    console.log('Count: ' + count);
    const username = await this.loadName();

    this.setState({
      loaded: true,
      name: username === null ? '' : username,
      counter: count === null ? 0 : parseInt(count)
    });
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

  loading() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  normal() {
    return <View style={styles.container}>
            <NavigationEvents
              onWillFocus={() => this.getData()}
              onWillBlur={() => console.log('Blurring Home component')}
            />
            <Banner />
            <NameSaver count={this.state.counter} name={this.state.name} onCounter={this.onCounterPressed} onNameSaved={this.onNameSaved} />
            <Text style={styles.normalText}>Open up my diiiiiiiiiiiiiiiiick!</Text>
            <TheFire onPress={ this.onPressFire } />
            <Footer />
          </View>;
  }

  onNameSaved(name) {
    this.setState({
      loaded: true,
      name: name
    });

    this.saveName(name);
  }

  onCounterPressed() {
    const newCount = this.state.counter + 1;

    this.setState({
      counter: newCount
    });

    this.saveCount(newCount);
  }
  
  onPressFire() {
    Alert.alert('TheFire pressed', 'You pressed TheFire!')
  }

  async saveCount(count) {
    AsyncStorage.setItem('count', count.toString())
                .catch(e => Alert.alert('Error Saving Count', 'Could not save the new count!'));
  }

  async saveName(name) {
    AsyncStorage.setItem('username', name)
                .catch(e => Alert.alert('Error Saving Username', 'Could not save the username!'));
  }

  render() {
    return (
      <View style={{ height: '100%', width: '100%'}}>
        { this.state.loaded ? this.normal() : this.loading() }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBlock: {
    flex: 1,
    width: '100%',
  },
  normalText: {
    flex: 1,
    backgroundColor: 'purple'
  }
});