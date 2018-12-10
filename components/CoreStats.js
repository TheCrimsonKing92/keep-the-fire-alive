import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Chilled = () => <Text style={{color: 'lightblue'}}>Chilled</Text>;
const Freezing = () => <Text style={{color: 'blue'}}>Freezing!</Text>;
const Thawed = () => <Text style={{color: 'green'}}>Thawed</Text>;
const Warm = () => <Text style={{color: 'orange'}}>Warm</Text>;
const Hot = () => <Text style={{color: 'red'}}>Hot!</Text>;

export default class CoreStats extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>Player Health {this.props.playerHealth}</Text>
        <Text>Fire Health {this.props.fireHealth}</Text>
        { this.props.fireHealth === 0 && <Freezing />}
        { this.props.fireHealth > 0 && this.props.fireHealth < 15 && <Chilled />}
        { this.props.fireHealth > 14 && this.props.fireHealth < 35 && <Thawed />}
        { this.props.fireHealth > 34 && this.props.fireHealth < 60 && <Warm />}
        { this.props.fireHealth > 59 && <Hot />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 8,
    width: '100%',
  },
  flexChild: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3
  }
});