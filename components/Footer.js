import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import StyleableButton from './StyleableButton'

const routes = [
  'Home', 'Settings', 'Skills', 'Stats'
];

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black'
  },
  container: {
    backgroundColor: '#edc9af',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    width: '100%',
  },
  flexChild: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3
  }
});

const FlexChild = ({route, onPress})  => {
  return (
    <StyleableButton containerStyle={styles.flexChild} buttonStyle={styles.button} onPress={onPress} text={route} />
  )
};

export default class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const current = routes.filter(r => r !== this.props.route)
                                       .map((r, id) => <FlexChild key={id} route={r} onPress={() => this.props.navigate(r)}/>);
    return (
      <View style={styles.container}>
        { current }
      </View>
    );
  }
};