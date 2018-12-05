import React from 'react'
import { Alert, AsyncStorage, InteractionManager, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation'
import Banner from '../Banner';
import CreateProfile from './CreateProfile'
import Footer from '../Footer';
import NameSaver from '../NameSaver'
import TheFire from '../TheFire';

const SAVE_KEY = '@keep-the-fire-alive/save';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastTick: new Date(),
      loaded: false,
      saveTicks: 0,
      player: {
        hasName: false,
        name: '',
        counter: 0
      }
    }

    this.advance = this.advance.bind(this);
    this.loadCount = this.loadCount.bind(this);
    this.loadName = this.loadName.bind(this);
    this.loading = this.loading.bind(this);
    this.normal = this.normal.bind(this);
    this.onCounterPressed = this.onCounterPressed.bind(this);
    this.onNameSaved = this.onNameSaved.bind(this);
    this.onPressFire = this.onPressFire.bind(this);
    this.saveCount = this.saveCount.bind(this);

    this.handle = InteractionManager.runAfterInteractions(this.advance);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.getData();
  }

  componentWillUnmount() {
    this.handle.cancel();
    this.handle = null;
  }

  advance() {
    this.evaluateSave();
  }

  createProfile() {
    return (
      <View style={styles.container}>
        <Banner />
        <CreateProfile onNameSaved={this.onNameSaved} />
      </View>
    );
  }

  evaluateSave() {

  }

  async getData() {
    this.setState({
      loaded: false
    });

    const count = await this.loadCount();
    const username = await this.loadName();

    this.setState({
      ...this.state,
      loaded: true,
      player: {
        hasName: username !== null && username !== '',
        name: username === null ? '' : username,
        counter: count === null ? 0 : parseInt(count)
      }
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
            />
            <Banner />
            <NameSaver count={this.state.player.counter} name={this.state.player.name} onCounter={this.onCounterPressed} onNameSaved={this.onNameSaved} />
            <Text style={styles.normalText}>Open up my diiiiiiiiiiiiiiiiick!</Text>
            <TheFire onPress={ this.onPressFire } />
            <Footer />
          </View>;
  }

  onNameSaved(name) {
    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        hasName: true,
        name: name
      }
    });

    this.saveName(name);
  }

  onCounterPressed() {
    const newCounter = this.state.player.counter + 1;

    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        counter: newCounter
      }
    });

    this.saveCount(newCounter);
  }
  
  onPressFire() {
    Alert.alert('TheFire pressed', 'You pressed TheFire!')
  }

  async save() {
    const toSave = {
      lastTick: new Date(),
      player: {
        count: this.state.player.count,
        name: this.state.player.name
      }
    };

    AsyncStorage.setItem(SAVE_KEY, JSON.stringify(toSave))
                .catch(e => {
                  Alert.alert('Save Error', 'Could not save data!');
                  console.error(e);
                });
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
        { !this.state.loaded && this.loading() }
        { this.state.loaded && !this.state.player.hasName && this.createProfile() }
        { this.state.loaded && this.state.player.hasName && this.normal() }
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