import React, { Component } from 'react';
import { Header, Icon } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaProvider>
        <Header
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#696969"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={{
            text: this.props.title,
            style: { color: '#90A5A9', fontSize: 20, fontWeight: 'bold' },
          }}
          backgroundColor="#eaf8fe"
        />
      </SafeAreaProvider>
    );
  }
}
