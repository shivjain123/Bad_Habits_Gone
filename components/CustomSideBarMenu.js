import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { DrawerItems } from 'react-navigation-drawer';

import firebase from 'firebase';
import db from '../config';

export default class CustomSideBarMenu extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      docId: '',
    };
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'orange',
          }}>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="large"
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />
        </View>

        <Text style={{ fontWeight: '100', fontSize: 20, paddingTop: 10 }}>
          {this.state.name}
        </Text>

        <DrawerItems {...this.props} />
        <View
          style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 60 }}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('WelcomeScreen');
              firebase.auth().signOut();
            }}>
            <Text style={styles.logOutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logOutButton: {
    justifyContent: 'center',
    padding: 10,
    marginLeft: 70,
    height: 60,
    width: 160,
    borderRadius: 20,
    borderColor: 'white',
    backgroundColor: '#eb0000',
  },
  imageContainer: {
    flex: 0.75,
    width: 200,
    height: 200,
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    color: 'white',
    marginLeft: 40,
    fontSize: 20,
  },
});
