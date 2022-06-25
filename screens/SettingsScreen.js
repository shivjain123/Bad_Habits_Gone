import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MyHeader from '../components/MyHeader';

import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: firebase.auth().currentUser.email,
      name: '',
      age: '',
      gender: '',
      city: '',
      province: '',
      country: '',
      mobile_number: '',
      docId: '',
    };
  }

  getData() {
    var email = firebase.auth().currentUser.email;

    db.collection('users')
      .where('emailId', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.emailId,
            name: data.name,
            age: data.age,
            gender: data.gender,
            city: data.city,
            province: data.province,
            country: data.country,
            mobile_number: data.mobile_number,
            docId: doc.id,
          });
        });
      });
  }

  updateData() {
    db.collection('users').doc(this.state.docId).update({
      age: this.state.age,
      gender: this.state.gender,
      city: this.state.city,
      province: this.state.province,
      country: this.state.country,
      mobile_number: this.state.mobile_number,
    });

    alert('Your Profile has been updated.');
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Settings" />
        <ScrollView>
          <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <TextInput
              style={styles.formTextInput}
              placeholder={'Name'}
              value={this.state.name}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Email'}
              keyboardType={'email-address'}
              value={this.state.emailId}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Contact'}
              maxLength={10}
              keyboardType={'numeric'}
              onChangeText={(text) => {
                this.setState({
                  mobile_number: text,
                });
              }}
              value={this.state.mobile_number}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Age'}
              onChangeText={(text) => {
                this.setState({
                  age: text,
                });
              }}
              value={this.state.age}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Gender'}
              onChangeText={(text) => {
                this.setState({
                  gender: text,
                });
              }}
              value={this.state.gender}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'City'}
              onChangeText={(text) => {
                this.setState({
                  city: text,
                });
              }}
              value={this.state.city}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'State/Province'}
              onChangeText={(text) => {
                this.setState({
                  province: text,
                });
              }}
              value={this.state.province}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Country'}
              onChangeText={(text) => {
                this.setState({
                  country: text,
                });
              }}
              value={this.state.country}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateData();
              }}>
              <Text> Save </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: 250,
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: 350,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
