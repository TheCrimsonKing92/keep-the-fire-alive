import React from 'react'
import { Alert, AsyncStorage, Button, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offerReset: false
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
      offerReset: true
    });
  }

  async resetProgress() {
    await AsyncStorage.removeItem('count')
                      .catch(e => Alert.alert('Error Resetting Profile', 'Could not reset count!'));

    await AsyncStorage.removeItem('username')
                      .catch(e => Alert.alert('Error Resetting Profile', 'Could not reset username!'));
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.offerReset}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}}>
              <View>
                <Text>Are you sure you want to reset?</Text>

                <TouchableHighlight
                  onPress={this.confirmReset}>
                  <Text>Yes</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={this.cancelReset}>
                  <Text>No</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        <Text>Settings</Text>
        <Button title="Reset" onPress={this.offerReset}>Reset</Button>
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