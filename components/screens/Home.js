import React from 'react'
import { ActivityIndicator, Alert, AsyncStorage, InteractionManager, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation'
import Banner from '../Banner';
import CreateProfile from './CreateProfile'
import Footer from '../Footer';
import GameLoop from '../GameLoop';
import NameSaver from '../NameSaver'
import { SAVE_KEY } from '../../Constants'
import TheFire from '../TheFire';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();

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

  createProfile() {
    return (
      <View style={styles.container}>
        <Banner />
        <CreateProfile onNameSaved={this.onNameSaved} />
      </View>
    );
  }

  evaluateSave() {
    const newTick = this.state.saveTicks + 1;

    this.setState({
      ...this.state,
      saveTicks: newTick === this.state.settings.saveTicks ? 0 : newTick
    });

    if (newTick === this.state.settings.saveTicks) {
      this.save();
    }
  }

  async getData() {
    this.setState({
      loaded: false
    });

    const data = await this.loadSave();
    if (data === null) {
      this.setState({
        ...this.getDefaultState(),
        loaded: true
      });
      return;
    }

    const { count, name } = data.player;
    const { saveTicks } = data.settings;

    this.setState({
      ...this.state,
      loaded: true,
      player: {
        hasName: name !== null && name !== '',
        name: name === null ? '' : name,
        counter: count === null ? 0 : parseInt(count)
      },
      settings: {
        saveTicks
      }
    });  
  }

  getDefaultState() {
    return {
      lastTick: new Date(),
      loaded: false,
      saveTicks: 0,
      player: {
        hasName: false,
        name: '',
        counter: 0
      },
      settings: {
        saveTicks: 60
      }
    };
  }

  async loadSave() {
    return AsyncStorage.getItem(SAVE_KEY)
                       .then(s => JSON.parse(s))
                       .catch(e => Alert.alert('No Save', 'Could not load save!'));
  }

  loading() {
    return (
      <View style={styles.container}>
        <Banner />
        <View style={{flex: 1}}>
          <ActivityIndicator size="large"/>
          <Text style={{fontSize: 20}}>Loading...</Text>
        </View>        
      </View>
    )
  }

  normal() {
    return <View style={styles.container}>
            <NavigationEvents onWillFocus={() => this.getData()} />
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
      player: {
        count: this.state.player.counter,
        name: this.state.player.name
      },
      settings: {
        saveTicks: this.state.settings.saveTicks
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

  updateHandler = ({ touches, screen, time }) => {
    const fire = touches.find(t => t.type === 'fire');

    if (fire) {
      this.onPressFire();
    }

    const counter = touches.find(t => t.type === 'counter');

    if (counter) {
      this.onCounterPressed();
    }

    this.setState({
      ...this.state,
      lastTick: new Date()
    })
    this.evaluateSave();
  };

  render() {
    let content;
    if (!this.state.loaded) {
      content = this.loading();
    } else if (!this.state.player.hasName) {
      content =  this.createProfile();
    } else {
      content = this.normal();
    }
    return (
      <GameLoop style={{ height: '100%', width: '100%' }} onUpdate={this.updateHandler}>
        { content }
      </GameLoop>
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