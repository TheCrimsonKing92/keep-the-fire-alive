import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-easy-toast'

import Banner from '../../components/Banner'
import DataService from '../../services/DataService'
import Footer from '../../components/Footer'
import StyleableButton from '../StyleableButton'

const AutoSave = (current, replace, disabled) => {
  const buttonTitle = 'Autosave Every ' + current + ' Seconds';

  return <StyleableButton buttonStyle={{backgroundColor: 'black'}} containerStyle={{marginTop: 5}} disabled={!!disabled} onPress={replace} text={buttonTitle}/>;
}

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: {
        autosave: false
      },
      loading: false,
      offerReset: false,
      saveTicks: 0
    };

    this.cancelReset = this.cancelReset.bind(this);
    this.Confirm = this.Confirm.bind(this);
    this.confirmReset = this.confirmReset.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.Loading = this.Loading.bind(this);
    this.offerReset = this.offerReset.bind(this);
    this.ProfileReset = this.ProfileReset.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.toast = this.toast.bind(this);
    this.updateSaveTicks = this.updateSaveTicks.bind(this);
  }

  cancelReset() {
    this.setState({
      ...this.state,
      offerReset: false
    });
  }

  componentDidMount() {
    this.getSettings();
  }

  Confirm() {
    return (
      <View style={{flex: 1, marginTop: 5}}>
        <Text>Profile will be reset</Text>
        <View style={{  flexDirection: 'row', width: '100%'}}>
          <StyleableButton buttonStyle={{backgroundColor: 'black'}} onPress={this.cancelReset} text={'Cancel'} />
          <StyleableButton buttonStyle={{backgroundColor: 'red'}} containerStyle={{marginLeft: 5}} onPress={this.confirmReset} text={'Confirm'} />
        </View>        
      </View>
    )
  }

  async confirmReset() {
    await this.resetProgress();

    this.setState({
      ...this.state,
      offerReset: false
    });

    this.getSettings();
  }

  getNextSaveTicks(current) {
    let next = current;

    switch (next) {
      case 10:
        next = 30;
        break;
      case 60:
      default:
        next = 10;
        break;
    }

    return next;
  }

  async getSettings() {
    this.setState({
      ...this.state,
      loading: true
    });

    try {
      const ticks = await DataService.getTicks();
      this.setState({
        loading: false,
        saveTicks: ticks.save.max
      });
    } catch (err) {
      this.toast('Unhandled error getting settings: ', err);
      return;
    }    
  }

  Loading() {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator size="large"/>
        <Text style={{fontSize: 20}}>Loading...</Text>
      </View>
    );
  }

  offerReset() {
    this.setState({
      offerReset: !this.state.offerReset
    });
  }

  ProfileReset() {
    return <StyleableButton buttonStyle={{backgroundColor: 'black'}} containerStyle={{marginTop: 5}} onPress={this.offerReset} text={'Reset Profile'} />;
  }

  async resetProgress() {
    const reset = DataService.clearData().then(() => this.toast('Successfully reset profile!'))
                                         .catch(e => this.toast('Could not reset profile with error: ' + e));

    await reset;
  }

  toast(message) {
    this.refs.toast.show(message, 4000);
  }

  async updateSaveTicks() {
    const next = this.getNextSaveTicks(this.state.saveTicks);

    this.setState({
      disabled: {
        ...this.state.disabled,
        autosave: true
      },
      saveTicks: next
    });

    try {
      await DataService.setSaveFrequency(next);
      this.toast('Successfully updated save frequency');
    } catch (e) {
      this.toast('Could not save new frequency');
      console.warn(e);
    }

    this.setState({
      disabled: {
        ...this.state.disabled,
        autosave: false
      }
    });  
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.getSettings}/>
        <Banner/>
        <Text style={{alignSelf: 'center', fontSize: 20}}>Settings</Text>
        <View style={{alignItems: 'flex-start', flex: 1, padding: 5}}>
          { this.state.loading && this.Loading() }
          { !this.state.loading && AutoSave(this.state.saveTicks, this.updateSaveTicks, this.state.disabled.autosave)}
          { !this.state.loading && !this.state.offerReset && this.ProfileReset()}
          { !this.state.loading && this.state.offerReset && this.Confirm()}
        </View>
        <Footer navigate={this.props.navigation.navigate} route={'Settings'} />        
        <Toast ref="toast" position="bottom" positionValue={50}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edc9af'
  }
});