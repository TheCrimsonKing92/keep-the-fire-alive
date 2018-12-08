import React from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import Toast from 'react-native-easy-toast'
import { NavigationEvents } from 'react-navigation'

import Banner from '../Banner';
import { FIRE_MAX_HEALTH, FPS } from '../../Constants';
import CreateProfile from './CreateProfile'
import DataService from '../../services/DataService'
import Welcome from '../Welcome'
import TheFire from '../TheFire';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();

    this.evaluateFire = this.evaluateFire.bind(this);
    this.getData = this.getData.bind(this);
    this.hurtFire = this.hurtFire.bind(this);
    this.loading = this.loading.bind(this);
    this.normal = this.normal.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onCounterPressed = this.onCounterPressed.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onNameSaved = this.onNameSaved.bind(this);
    this.onPressFire = this.onPressFire.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.getData();
    this.handle = setInterval(this.updateHandler, 1000/FPS);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.loaded !== nextState.loaded) {
      return true;
    }

    if (this.state.player.fire !== nextState.player.fire) {
      return true;
    }

    if (this.state.player.hasName !== nextState.player.hasName || this.state.playername !== nextState.player.name) {
      return true;
    }

    if (this.state.player.counter !== nextState.player.counter) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    clearInterval(this.handle);
  }

  createProfile() {
    return (
      <View style={styles.container}>
        <Banner />
        <CreateProfile onNameSaved={this.onNameSaved} />
      </View>
    );
  }

  evaluateFire() {
    const newTick = this.state.ticks.fire.current + 1;

    this.setState({
      ticks: {
        ...this.state.ticks,
        fire: {
          ...this.state.ticks.fire,
          current: newTick === this.state.ticks.fire.max ? 0 : newTick
        }
      }
    });

    if (newTick === this.state.ticks.fire.max) {
      this.hurtFire();
    }
  }

  evaluateSave() {
    if (!this.state.hasName) {
      return;
    }

    const newTick = this.state.saveTicks + 1;

    this.setState({
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

    const { count, fire, name } = data.player;
    const { saveTicks } = data.settings;

    this.setState({
      ...this.state,
      loaded: true,
      player: {
        fire,
        hasName: name !== null && name !== '',
        name,
        counter: parseInt(count) || 0
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
      // TODO Deprecate reading save tick current value here
      saveTicks: 0,
      saving: true,
      player: {
        fire: 100,
        hasName: false,
        name: ''
      },
      // TODO Deprecate reading save tick max value here
      settings: {
        saveTicks: 600
      },
      ticks: {
        fire: {
          current: 0,
          max: 300
        },
        save: {
          current: 0,
          max: 600
        }
      },
      ui: {

      }
    };
  }

  hurtFire() {
    const fire = this.state.player.fire - 1;

    this.setState({
      player: {
        ...this.state.player,
        fire
      }
    });
  }

  async loadSave() {
    try {
      return await DataService.getData();
    } catch (e) {
      this.toast('Could not load save');
      console.error('Could not load save with error: ' + e);
    }
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
            <Welcome name={this.state.player.name} />
            <Text>Fire Health {this.state.player.fire}</Text>
            <TheFire onPress={ this.onPressFire } />
          </View>;
  }

  onBlur() {
    this.pauseAutosave();
  }

  async onNameSaved(name) {
    this.setState({
      player: {
        ...this.state.player,
        hasName: true,
        name: name
      }
    }, this.save);
  }

  onCounterPressed() {
    const newCounter = this.state.player.counter + 1;

    this.setState({
      player: {
        ...this.state.player,
        counter: newCounter
      }
    });
  }

  async onFocus() {
    await this.getData();
    this.resumeAutosave();
  }
  
  onPressFire() {
    if (this.state.player.fire >= FIRE_MAX_HEALTH) {
      return;
    }

    this.setState({
      player: {
        ...this.state.player,
        fire: this.state.player.fire + 1
      }
    });
  }

  pauseAutosave() {
    this.setState({
      saving: false
    });
  }

  resumeAutosave() {
    this.setState({
      saving: true
    });
  }

  async save() {
    const toSave = {
      player: {
        count: this.state.player.counter,
        fire: this.state.player.fire,
        name: this.state.player.name
      },
      settings: {
        saveTicks: this.state.settings.saveTicks
      }
    };

    DataService.setData(toSave)
               .catch(e => {
                 this.toast('Could not save data!');
                 console.error('Could not save data with error: ' + e);
               });
  }

  toast(message) {
    this.refs.toast.show(message);
  }

  updateHandler = () => {
    this.setState({
      lastTick: new Date()
    });
    
    this.evaluateFire();
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
      <View style={{ height: '100%', width: '100%' }}>
        <NavigationEvents onWillBlur={this.onBlur} onWillFocus={this.onFocus}/>
        { content }
        <Toast ref="toast" position="bottom" positionValue={50}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  normalText: {
    flex: 1,
    backgroundColor: 'blue'
  }
});