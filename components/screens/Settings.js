import React from 'react'
import { ActivityIndicator, Alert, Button, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Banner from '../../components/Banner'
import MyButton from '../../components/MyButton'
import { clearData, getData, setData } from '../../services/DataService'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-easy-toast'

const AutoSave = (current, replace, disabled) => {
  const seconds = current / 60;
  const unit = seconds > 1 ? ' Seconds' : ' Second'
  const buttonTitle = 'Autosave Every ' + seconds + unit;

  return <MyButton containerStyle={{marginTop: 5}} disabled={!!disabled} onPress={replace} text={buttonTitle}/>;
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
      saveTicks: 60
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
        <NavigationEvents onWillFocus={this.getSettings} />
        <Text>Profile will be reset</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyButton containerStyle={{width: '40%'}} onPress={this.cancelReset} text={'Cancel'} />
          <MyButton buttonStyle={{backgroundColor: 'red'}} containerStyle={{width: '40%'}} onPress={this.confirmReset} text={'Confirm'} />
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
  }

  getNextSaveTicks(current) {
    let next = current;

    switch (next) {
      case 30:
        next = 150;
        break;
      case 150:
        next = 300;
        break;
      case 300:
        next = 900;
        break;
      case 900:
        next = 1800;
        break;
      case 1800:
      default:
        next = 60;
        break;
    }

    return next;
  }

  async getSettings() {
    this.setState({
      ...this.state,
      loading: true
    });

    const settings = await getData().then(JSON.parse)
                                    .then(s => s.settings)
                                    .catch(e => this.toast('Could not get settings with error: ' + e));

    if (settings === null) {
      return;
    }

    this.setState({
      ...this.state,
      loading: false,
      saveTicks: settings.saveTicks
    });
    
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
    return <MyButton containerStyle={{marginTop: 5}} onPress={this.offerReset} text={'Reset Profile'} />;
  }

  async resetProgress() {
    const reset = clearData().then(() => this.toast('Successfully reset profile!'))
                             .catch(e => this.toast('Could not reset profile with error: ' + e));

    await reset;
  }

  toast(message) {
    this.refs.toast.show(message, 4000);
  }

  async updateSaveTicks() {
    const current = await getData().then(JSON.stringify).catch(e => this.toast('Failed to retrieve prereq with error: ' + e));
    if (current === null) {
      console.error('Error state, exiting');
      return;
    }

    const next = this.getNextSaveTicks(this.state.saveTicks);

    this.setState({
      disabled: {
        ...this.state.disabled,
        autosave: true
      },
      saveTicks: next
    });

    const newData = {
      ...current,
      settings: {
        ...current.settings,
        saveTicks: next
      }
    };

    await setData(newData).then(() => this.toast('Successfully updated save frequency'))
                          .catch(e => this.toast('Could not save new frequency with error: ' + e));

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
        <Banner/>
        <Text style={{alignSelf: 'center', fontSize: 20}}>Settings</Text>
        <View style={{alignItems: 'flex-start', flex: 1, padding: 5}}>
          { this.state.loading && this.Loading() }
          { !this.state.loading && AutoSave(this.state.saveTicks, this.updateSaveTicks, this.state.disabled.autosave)}
          { !this.state.loading && !this.state.offerReset && this.ProfileReset()}
          { !this.state.loading && this.state.offerReset && this.Confirm()}
        </View>        
        <Toast ref="toast" position="bottom" positionValue={50}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 5
  }
});