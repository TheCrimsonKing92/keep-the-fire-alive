import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import Toast from '../Toast';
import { NavigationEvents } from 'react-navigation';

import Autosave from '../Autosave';
import Banner from '../Banner';
import { flexItem, fullScreen, row, verticalCenter } from '../../CommonStyles';
import { DIRT_DELAY, FIRE_DELAY, FIRE_MAX_HEALTH, FIRE_MIN_HEALTH, FPS, PROGRESS_TIME, TEMPERATURE_THRESHOLD } from '../../Constants';
import CoreStats from '../CoreStats'
import CreateProfile from './CreateProfile';
import DataService from '../../services/DataService';
import DirtRow from '../DirtRow';
import FireRow from '../FireRow';
import Footer from '../Footer';
import { DIRT_FAIL_MESSAGES, DIRT_START_MESSAGE, DIRT_SUCCESS_MESSAGES } from '../../Messages';
import Title from '../Title';
import { randomBool, selectRandom } from '../../Util';
import AnimatedBar from 'react-native-animated-bar';

const toastKeys = [
  'toast0',
  'toast1',
  'toast2',
  'toast3',
  'toast4',
  'toast5',
  'toast6',
  'toast7',
  'toast8',
  'toast9'
];

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();

    this.advanceDirt = this.advanceDirt.bind(this);
    this.checkToastQueue = this.checkToastQueue.bind(this);
    this.consumeToast = this.consumeToast.bind(this);
    this.disableDirt = this.disableDirt.bind(this);
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
    this.regenerateToast = this.regenerateToast.bind(this);
    this.selectDirtFailMessage = this.selectDirtFailMessage.bind(this);
    this.selectDirtSuccessMessage = this.selectDirtSuccessMessage.bind(this);
    this.showToast = this.showToast.bind(this);
    this.startDirtEnableProgress = this.startDirtEnableProgress.bind(this);
    this.toast = this.toast.bind(this);
    this.toastConsumed = this.toastConsumed.bind(this);
    this.toasts = this.toasts.bind(this);
    this.toastsConsumed = this.toastsConsumed.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    this.getData();
    this.handle = setInterval(this.updateHandler, 1000/FPS);
    this.queue = [];
    this.toastTracking = toastKeys.reduce((ob, curr) => ({...ob, [curr]: false}), {});
  }

  componentWillUnmount() {
    clearInterval(this.handle);
  }

  componentDidUpdate(previousProps, previousState) {
    if (!previousState.player.hasName && this.state.player.hasName) {
      this.save();
    }

    if (previousState.ticks.fire.current !== this.state.ticks.fire.current && this.state.ticks.fire.current === this.state.ticks.fire.max) {
      this.hurtFire();
    }

    if (previousState.fire.current !== this.state.fire.current) {
      this.evaluateHypothermia(previousState.fire.current, this.state.fire.current);
    }

    if (previousState.fireDisabled.now === false && this.state.fireDisabled.now === true) {
      this.scheduleFireEnableProgress(PROGRESS_TIME - 10);
    }

    if (previousState.dirtDisabled.now === true && this.state.dirtDisabled.now === false) {
      clearInterval(this.dirtProgress);
      this.toast(randomBool() ? this.selectDirtSuccessMessage() : this.selectDirtFailMessage(), DIRT_DELAY);
    } else if (!previousState.dirtDisabled.now && this.state.dirtDisabled.now) {
      this.toast(DIRT_START_MESSAGE, DIRT_DELAY);
      this.startDirtEnableProgress();
    }
  }

  advanceDirt() {
    this.setState((previousState, props) => {
      const current = previousState.dirtDisabled.current + 1;
      const max = previousState.dirtDisabled.max;
      return {
        dirtDisabled: {
          current,
          max,
          now: !(current === max)
        }
      }
    });
  }

  checkToastQueue() {
    while (this.queue.length > 0 && !this.toastsConsumed()) {
      this.showToast(this.queue.shift());
    }
  }

  consumeToast(key, toast) {
    this.toastTracking[key] = true;
    this.refs[key].show(toast.message, toast.duration, () => this.regenerateToast(key));
  }

  createProfile() {
    return (
      <View style={styles.container}>
        <Banner />
        <CreateProfile onNameSaved={this.onNameSaved} />
      </View>
    );
  }

  disableDirt() {
    this.setState((previousState, props) => ({
      dirtDisabled: {
        current: 0,
        max: previousState.dirtDisabled.max,
        now: true
      }
    }));
  }

  evaluateFireHealth() {
    if (this.state.fire.current <= FIRE_MIN_HEALTH) {
      return;
    }

    const previous = this.state.ticks.fire.current;

    const current = previous === this.state.ticks.fire.max ? 0 : previous + 1;

    this.setState((previousState, props) => ({
      ticks: {
        ...previousState.ticks,
        fire: {
          ...previousState.ticks.fire,
          current
        }
      }
    }));
  }

  evaluateFreeze() {
    if (this.state.fire.current < TEMPERATURE_THRESHOLD.CHILLED) {
      const next = this.state.ticks.freeze.current + 2;

      if (next >= this.state.ticks.freeze.max) {
        this.setState((previousState, props) => ({
          player: {
            ...previousState.player,
            health: {
              max: previousState.player.health.max,
              current: previousState.player.health.current - 1
            }
          },
          ticks: {
            ...previousState.ticks,
            freeze: {
              current: 0,
              max: previousState.ticks.freeze.max
            }
          }
        }));
        return;
      } else {
        this.setState((previousState, props) => ({
          ticks: {
            ...previousState.ticks,
            freeze: {
              current: next,
              max: previousState.ticks.freeze.max
            }
          }
        }));
        return;
      }
    }

    if (this.state.fire.current < TEMPERATURE_THRESHOLD.THAWED) {
      const next = this.state.ticks.freeze.current + 1;

      if (next >= this.state.ticks.freeze.max) {
        this.setState((previousState, props) => ({
          player: {
            ...previousState.player,
            health: {
              max: previousState.player.health.max,
              current: previousState.player.health.current - 1
            }
          },
          ticks: {
            ...previousState.ticks,
            freeze: {
              current: 0,
              max: previousState.ticks.freeze.max
            }
          }
        }));
      } else {
        this.setState((previousState, props) => ({
          ticks: {
            ...previousState.ticks,
            freeze: {
              current: next,
              max: previousState.ticks.freeze.max
            }
          }
        }));
      }
    }
  }

  evaluateHypothermia(previous, current) {
    if (previous < TEMPERATURE_THRESHOLD.WARM && current >= TEMPERATURE_THRESHOLD.WARM) {
      this.toast('Hypothermia abates...');
    } else if (previous >= TEMPERATURE_THRESHOLD.WARM && current < TEMPERATURE_THRESHOLD.WARM) {
      this.toast('Hypothermia sets in...');
    } else {
      return;
    }
  }

  freeze() {
    this.setState((previousState, props) => ({
      player: {
        ...previousState.player,
        health: previousState.health - 1
      }
    }));
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
        health: state.player.health,
        name: state.player.name
      },
      ticks: state.ticks
    }
  }

  hurtFire() {
    const previous = this.state.fire.current;
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
        <CoreStats fireHealth={this.state.fire.current} playerHealth = {this.state.player.health.current}/>
        <Row>
          <View style={{alignItems: 'center', marginBottom: 5, width: 116}}>
            <Title style={{color: 'blue', fontSize: 18}} text={'Hypothermia'}/>
          </View>
          <View style={[styles.flexItem, styles.verticalCenter]}>
            <AnimatedBar duration={5} progress={this.state.ticks.freeze.current / this.state.ticks.freeze.max} />
          </View>          
        </Row>
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
    }));
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

    this.disableDirt();
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
    }));
  }

  startDirtEnableProgress() {
    this.dirtProgress = setInterval(this.advanceDirt, PROGRESS_TIME);
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

  regenerateToast(key) {
    this.toastTracking[key] = false;
    this.checkToastQueue();
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

  showToast(toast) {
    for (const key of toastKeys) {
      if (!this.toastConsumed(key)) {
        this.consumeToast(key, toast);
        return;
      }
    }

    // None available
    this.queue.unshift(toast);
  }

  toast(message, duration = 1000) {
    if (this.toastsConsumed()) {
      this.queue.push({
        duration,
        message
      });
      return;
    }

    this.showToast({
      duration,
      message
    });
  }

  toastConsumed(key){
    return this.toastTracking[key];
  }

  toasts() {
    return toastKeys.map((key, index) => <Toast key={index} ref={key} position="bottom" positionValue={40 + (45 * index)}/>)
  }

  toastsConsumed() {
    for (const key of toastKeys) {
      if (!this.toastConsumed(key)) {
        return false;
      }
    }

    return true;
  }

  updateHandler = () => {
    if (!this.state.player.hasName) {
      return;
    }

    this.evaluateFireHealth();
    this.evaluateFreeze();
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
        { this.toasts() }
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