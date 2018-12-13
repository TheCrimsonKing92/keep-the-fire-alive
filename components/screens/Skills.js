import React from 'react';
import { StyleSheet, View } from 'react-native';

import Banner from '../Banner';
import Footer from '../Footer';
import Title from '../Title';
import { container } from '../../CommonStyles';

export default class Skills extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Banner/>
        <Title text={'Skills'}/>
        <View style={{flex: 1}}></View>
        <Footer navigate={this.props.navigation.navigate} route={'Skills'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container
});