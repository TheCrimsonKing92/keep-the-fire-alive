import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import Toast from 'react-native-easy-toast';
import { NavigationEvents } from 'react-navigation';

import Banner from '../Banner';
import { DIRT_DELAY, FIRE_DELAY, FIRE_MAX_HEALTH, FIRE_MIN_HEALTH, FPS } from '../../Constants';
import CoreStats from '../CoreStats'
import CreateProfile from './CreateProfile';
import Footer from '../Footer';
import DataService from '../../services/DataService';
import { DIRT_FAIL_MESSAGES, DIRT_START_MESSAGE, DIRT_SUCCESS_MESSAGES } from '../../Messages';
import { selectRandom } from '../../Util';
import TheDirt from '../TheDirt';
import TheFire from '../TheFire';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();

    this.evaluateFireHealth = this.evaluateFireHealth.bind(this);
    this.getData = this.getData.bind(this);
    this.hurtFire = this.hurtFire.bind(this);
    this.loading = this.loading.bind(this);
    this.normal = this.normal.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onNameSaved = this.onNameSaved.bind(this);
    this.onPressDirt = this.onPressDirt.bind(this);
    this.onPressFire = this.onPressFire.bind(this);
    this.selectDirtFailMessage = this.selectDirtFailMessage.bind(this);
    this.selectDirtSuccessMessage = this.selectDirtSuccessMessage.bind(this);
    this.toast = this.toast.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.getData();
    this.handle = setInterval(this.updateHandler, 1000/FPS);
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

  evaluateFireHealth() {
    if (this.state.fire.current <= FIRE_MIN_HEALTH) {
      return;
    }

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
    if (!this.state.player.hasName || !this.state.saving) {
      return;
    }

    const save = this.state.ticks.save;
    const newTick = save.current + 1;
    const isSave = newTick === save.max;

    this.setState({
      ticks: {
        ...this.state.ticks,
        save: {
          current: isSave ? 0 : newTick,
          max: save.max
        }
      }
    });

    if (isSave) {
      this.save();
    }
  }

  async getData() {
    this.setState({
      loaded: false
    });

    const data = await this.loadSave();
    console.info('Data: ', data);

    const player = {
      ...data.player,
      hasName: data.player.name !== null && data.player.name !== ''
    };
    const fire = data.fire;
    const ticks = data.ticks;

    this.setState({
      ...this.state,
      loaded: true,
      fire,
      player: {
        ...player,
        hasName: player.name !== null && player.name !== ''
      },
      ticks: {
        ...this.state.ticks,
        save: ticks.save
      }
    }); 
  }

  getDefaultState() {
    return {
      ...DataService.getDefault(),
      dirtDisabled: false,
      fireDisabled: false,
      loaded: false,
      saving: true,
      ui: {}
    };
  }

  hurtFire() {
    const next = this.state.fire.current - 1;

    this.setState({
      fire: {
        ...this.state.fire,
        current: next
      },
      player: {
        ...this.state.player,
        fire: next
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
            <Banner />
            <CoreStats fireHealth={this.state.fire.current} playerHealth = {10}/>
            <TheFire disabled={this.state.fireDisabled} onPress={this.onPressFire}/>
            <TheDirt disabled={this.state.dirtDisabled} onPress={this.onPressDirt}/>
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

  async onFocus() {
    await this.getData();
    this.resumeAutosave();
  }

  selectDirtFailMessage() {
    return selectRandom(DIRT_FAIL_MESSAGES);
  }

  selectDirtSuccessMessage() {
    return selectRandom(DIRT_SUCCESS_MESSAGES);
  }

  onPressDirt() {
    if (this.state.dirtDisabled) {
      return;
    }

    this.setState({
      dirtDisabled: true
    });
    this.toast(DIRT_START_MESSAGE);

    const message = Math.random() > 0.5 ? this.selectDirtSuccessMessage() : this.selectDirtFailMessage();
    setTimeout(() => {
      this.toast(message, 1000);
      this.setState({
        dirtDisabled: false
      });
    }, DIRT_DELAY);
  }
  
  onPressFire() {
    if (this.state.fireDisabled || this.state.fire.current >= FIRE_MAX_HEALTH) {
      return;
    }

    const current = this.state.fire.current + 1;

    this.setState({
      fireDisabled: true,
      fire: {
        ...this.state.fire,
        current
      },
      player: {
        ...this.state.player,
        fire: current
      }
    });

    setTimeout(() => {
      this.setState({
        fireDisabled: false
      });
    }, FIRE_DELAY);
  }

  async pauseAutosave() {
    await this.save();
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
      fire: this.state.fire,
      player: {
        name: this.state.player.name
      },
      ticks: {
        ...this.state.ticks,
        save: this.state.ticks.save
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
    if (!this.state.player.hasName) {
      return;
    }

    this.evaluateFireHealth();
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
      <View style={styles.fullscreen}>
        <NavigationEvents onWillBlur={this.onBlur} onWillFocus={this.onFocus}/>
        { content }
        <Footer navigate={this.props.navigation.navigate} route={'Home'} />
        <Toast ref="toast" position="bottom" positionValue={50}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edc9af',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fullscreen: {
    height: '100%',
    width: '100%'
  },
  normalText: {
    flex: 1,
    backgroundColor: 'blue'
  }
});