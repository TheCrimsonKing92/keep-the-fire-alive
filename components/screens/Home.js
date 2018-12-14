import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import AnimatedBar from 'react-native-animated-bar';
import Toast from 'react-native-easy-toast';
import { NavigationEvents } from 'react-navigation';

import Autosave from '../Autosave';
import Banner from '../Banner';
import { flexItem, fullScreen, row, verticalCenter } from '../../CommonStyles';
import { DIRT_DELAY, FIRE_DELAY, FIRE_MAX_HEALTH, FIRE_MIN_HEALTH, FPS, PROGRESS_TIME } from '../../Constants';
import CoreStats from '../CoreStats'
import CreateProfile from './CreateProfile';
import DataService from '../../services/DataService';
import DirtRow from '../DirtRow';
import FireRow from '../FireRow';
import Footer from '../Footer';
import { DIRT_FAIL_MESSAGES, DIRT_START_MESSAGE, DIRT_SUCCESS_MESSAGES } from '../../Messages';
import Row from '../Row';
import TheDirt from '../TheDirt';
import TheFire from '../TheFire';
import { randomBool, selectRandom } from '../../Util';

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
    this.setState((previousState, props) => ({
      ticks: {
        ...previousState.ticks,
        fire: {
          ...previousState.ticks.fire,
          current: newTick === previousState.ticks.fire.max ? 0 : newTick
        }
      }
    }));

    if (newTick === this.state.ticks.fire.max) {
      this.hurtFire();
    }
  }

  async getData() {
    this.setState({
      loaded: false
    });

    const data = await this.loadSave();

    const player = {
      ...data.player,
      hasName: data.player.name !== null && data.player.name !== ''
    };
    const fire = data.fire;
    const ticks = data.ticks;

    this.setState((previousState, props) => ({
      loaded: true,
      fire,
      player,
      ticks
    }));
  }

  getDefaultState() {
    return {
      ...DataService.getDefault(),
      dirtDisabled: {
        now: false,
        current: DIRT_DELAY / PROGRESS_TIME,
        max: DIRT_DELAY / PROGRESS_TIME
      },
      fireDisabled: {
        now: false,
        current: FIRE_DELAY / PROGRESS_TIME,
        max: FIRE_DELAY / PROGRESS_TIME
      },
      loaded: false,
      saving: true,
      ui: {}
    };
  }

  getSaveData(state) {
    return {
      fire: state.fire,
      player: {
        name: state.player.name
      },
      ticks: state.ticks
    }
  }

  hurtFire() {
    const next = this.state.fire.current - 1;

    this.setState((previousState, props) => ({
      fire: {
        ...previousState.fire,
        current: previousState.fire.current  - 1
      }
    }));
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
    return (
      <View style={styles.container}>
        <Autosave data={this.state} saving={this.state.saving} saveTime={this.state.ticks.save.current} transform={this.getSaveData} />
        <Banner />
        <CoreStats fireHealth={this.state.fire.current} playerHealth = {10}/>
        <FireRow fireDisabled={this.state.fireDisabled.now} fireProgress={this.state.fireDisabled.current / this.state.fireDisabled.max} onPressFire={this.onPressFire} />
        <DirtRow disabled={this.state.dirtDisabled.now} progress={this.state.dirtDisabled.current / this.state.dirtDisabled.max} onPressDirt={this.onPressDirt}/>
      </View>
    );
  }

  onBlur() {
    this.pauseAutosave();
  }

  async onNameSaved(name) {
    this.setState((previousState, props) => ({
      player: {
        ...previousState.player,
        hasName: true,
        name
      }
    }), this.save);
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
    if (this.state.dirtDisabled.now) {
      return;
    }

    this.setState((previousState, props) => ({
      dirtDisabled: {
        current: 0,
        max: previousState.dirtDisabled.max,
        now: true
      }
    }), () => {
      this.toast(DIRT_START_MESSAGE, DIRT_DELAY * (3/4));
      this.scheduleDirtEnableProgress(PROGRESS_TIME);
    });
  }
  
  onPressFire() {
    if (this.state.fireDisabled.now || this.state.fire.current >= FIRE_MAX_HEALTH) {
      return;
    }

    const current = this.state.fire.current + 1;

    // Disable the fire and kick off the progress timer
    this.setState((previousState, props) => ({
      fireDisabled: {
        current: 0,
        max: previousState.fireDisabled.max,
        now: true
      },
      fire: {
        ...previousState.fire,
        current
      }
    }), () => this.scheduleFireEnableProgress(PROGRESS_TIME));
  }

  scheduleDirtEnableProgress(delay) {
    setTimeout(() => {
      const current = this.state.dirtDisabled.current + 1;

      if (current === this.state.dirtDisabled.max) {
        this.setState((previousState, props) =>({
          dirtDisabled: {
            current,
            max: previousState.dirtDisabled.max,
            now: false
          }
        }), () => this.toast(randomBool() ? this.selectDirtSuccessMessage() : this.selectDirtFailMessage(), 500));
        return;
      }

      this.setState((previousState, props) => ({
        dirtDisabled: {
          ...previousState.dirtDisabled,
          current
        }
      }), () => this.scheduleDirtEnableProgress(delay));
    }, delay);
  }

  scheduleFireEnableProgress(delay) {
    setTimeout(() => {
      const current = this.state.fireDisabled.current + 1;

      if (current === this.state.fireDisabled.max) {
        this.setState((previousState, props) =>({
          fireDisabled: {
            current,
            max: previousState.fireDisabled.max,
            now: false
          }
        }));
        return;
      }

      this.setState((previousState, props) => ({
        fireDisabled: {
          ...previousState.fireDisabled,
          current
        }
      }), () => this.scheduleFireEnableProgress(delay));
    }, delay);
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
    const toSave = this.getSaveData(this.state);

    DataService.setData(toSave)
                        .catch(e => {
                          this.toast('Could not save data!');
                          console.error('Could not save data with error: ' + e);
                        });
  }

  toast(message, duration) {
    this.refs.toast.show(message, duration);
  }

  updateHandler = () => {
    if (!this.state.player.hasName) {
      return;
    }

    this.evaluateFireHealth();
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
      <View style={styles.fullScreen}>
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
  flexItem,
  fullScreen,
  row,
  verticalCenter
});