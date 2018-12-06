import React from 'react'
import { ActivityIndicator, Alert, Button, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Banner from '../../components/Banner'
import { clearData, getData, setData } from '../../services/DataService'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-easy-toast'

const AutoSave = (current, replace) => {
  const seconds = current / 60;
  const unit = seconds > 1 ? ' Seconds' : ' Second'
  const buttonTitle = 'Autosave Every ' + seconds + unit;
  return (
   <Button style={{ flex: 1, marginTop: 5, marginBottom: 5}} title={buttonTitle} onPress={replace}/>
  );
}

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
        <Text style={{alignSelf: 'center'}}>Profile will be reset</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableHighlight style={{width: '40%'}} onPress={this.cancelReset}>
            <View style={styles.button}>
              <Text style={styles.text}>Cancel</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{width: '40%'}} onPress={this.confirmReset}>
            <View style={styles.buttonRed}>
              <Text style={styles.text}>Confirm</Text>
            </View>  
          </TouchableHighlight>
        </View>        
      </View>
    )
  }

  confirmReset() {
    this.setState({
      ...this.state,
      offerReset: false
    });

    this.resetProgress();
  }

  getNextSaveTicks(current) {
    let next = current;

    switch (next) {
      case 60:
        next = 300;
        break;
      case 300:
        next = 600;
        break;
      case 600:
        next = 1800;
        break;
      case 1800:
        next = 3600;
        break;
      case 3600:
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
    return (
      <View style={{flex: 1, marginTop: 5}}>
        <Button style={{flex: 1}} title="Reset Profile" onPress={this.offerReset}/>
      </View>
    );
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
      ...this.state,
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Banner/>
        <Text style={{flex: 1, fontSize: 20}}>Settings</Text>
        { this.state.loading && this.Loading() }
        { !this.state.loading && AutoSave(this.state.saveTicks, this.updateSaveTicks)}
        { !this.state.loading && !this.state.offerReset && this.ProfileReset()}
        { !this.state.loading && this.state.offerReset && this.Confirm()}
        <Toast ref="toast" position="top"/>
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
    paddingBottom: 5
  },
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  buttonRed: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      backgroundColor: 'red',
      borderRadius: 2
    }
  }),
  text: {
    textAlign: 'center',
    padding: 8,
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '500',
      },
    }),
  },
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  })
});