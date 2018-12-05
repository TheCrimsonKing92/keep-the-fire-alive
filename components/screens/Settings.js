import React from 'react'
import { Alert, AsyncStorage, Button, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { SAVE_KEY } from '../../Constants';

const AutoSave = (current, replace) => {
  const buttonTitle = 'Autosave Every ' + current + ' Ticks';
  return (
   <Button title={buttonTitle} onPress={replace}/>
  );
}

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offerReset: false,
      saveTicks: 60
    };

    this.cancelReset = this.cancelReset.bind(this);
    this.confirmReset = this.confirmReset.bind(this);
    this.offerReset = this.offerReset.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
  }

  cancelReset() {
    this.setState({
      offerReset: false
    });
  }

  confirmReset() {
    this.setState({
      offerReset: false
    });

    this.resetProgress();
  }

  offerReset() {
    this.setState({
      offerReset: !this.state.offerReset
    });
  }

  async resetProgress() {
    await AsyncStorage.removeItem(SAVE_KEY)
                      .catch(e => Alert.alert('Error Resetting Profile', 'Could not reset profile!'));
  }

  confirm() {
    return (
      <View>
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={{flex: 1, fontSize: 20}}>Settings</Text>
        { !this.state.offerReset && <Button style={{flex: 1}} title="Reset Profile" onPress={this.offerReset} />}
        { this.state.offerReset && this.confirm() }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
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