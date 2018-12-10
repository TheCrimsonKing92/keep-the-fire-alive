import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Footer from '../Footer';

export default class Skills extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Skills</Text>
        <Footer navigate={this.props.navigation.navigate} route={'Skills'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edc9af',
    alignItems: 'center',
    justifyContent: 'flex-start',
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