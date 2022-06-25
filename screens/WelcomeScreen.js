import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as Speech from 'expo-speech';

import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
      confirmPassword: '',
      isVisible: false,
      name: '',
      age: '',
      gender: '',
      city: '',
      province: '',
      country: '',
      mobileNumber: '',
      isGoalActive: false,
      surp: 'you have successfully logged in.',
    };
  }

  speak = () => {
    var thing = this.state.surp;
    Speech.speak(thing);
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('Home');
        db.collection('habitDetails').onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            var data = doc.data();
            console.log(doc.data());
            var docId = doc.id;
            var dataTimer = data.timer;
            var date = new Date().toLocaleDateString().split('/');
            var timer1 = date[1];
            console.log(timer1);
            if (timer1 !== dataTimer) {
              db.collection('habitDetails').doc(docId).update({
                counter: 0,
              });
            }
          });
        });
        alert('User Successfully Logged In.');
        this.speak();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return alert("Password doesn't match\nPlease Check your Password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then((response) => {
          db.collection('users')
            .add({
              name: this.state.name,
              mobile_number: this.state.mobileNumber,
              emailId: this.state.emailId,
              age: this.state.age,
              gender: this.state.gender,
              city: this.state.city,
              province: this.state.province,
              country: this.state.country,
              isGoalActive: this.state.isGoalActive,
            })
            .then(() => {
              this.props.navigation.navigate('Home');
            });
          return Alert.alert('User Added Successfully', '', [
            { text: 'OK', onPress: () => this.setState({ isVisible: false }) },
          ]);
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.isVisible}>
      <View style={styles.modalContainer}>
        <ScrollView style={{ width: '100%' }}>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                fontSize: 30,
                color: '#ff5722',
                margin: 50,
              }}>
              Registration
            </Text>
            <TextInput
              style={styles.formTextInput}
              placeholder={'Name'}
              onChangeText={(text) => {
                this.setState({
                  name: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Age'}
              onChangeText={(text) => {
                this.setState({
                  age: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Mobile Number'}
              maxLength={10}
              keyboardType={'numeric'}
              onChangeText={(text) => {
                this.setState({
                  mobileNumber: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Gender'}
              onChangeText={(text) => {
                this.setState({
                  gender: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'EmailId'}
              keyboardType={'email-address'}
              onChangeText={(text) => {
                this.setState({
                  emailId: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Password'}
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Confrim Password'}
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  confirmPassword: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'City'}
              onChangeText={(text) => {
                this.setState({
                  city: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'State/Province'}
              onChangeText={(text) => {
                this.setState({
                  province: text,
                });
              }}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Country'}
              onChangeText={(text) => {
                this.setState({
                  country: text,
                });
              }}
            />
            <View style={styles.modalBackButton}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() =>
                  this.userSignUp(
                    this.state.emailId,
                    this.state.password,
                    this.state.confirmPassword
                  )
                }>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBackButton}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  this.setState({
                    isVisible: false,
                  })
                }>
                <Text style={{ color: '#ff5722' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </Modal>
  );

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {this.showModal()}
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.title}>Bad Habits Gone</Text>
            <Text style={styles.quote}>
              {' '}
              Your Small Step will be a Giant Leap for your Healthy Future{' '}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ alignItems: 'center' }}>
              <TextInput
                style={styles.loginBox}
                placeholder={'EMAIL ID'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TextInput
                style={styles.loginBox}
                placeholder={'PASSWORD'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.button, { marginBottom: 10 }]}
                onPress={() => {
                  this.userLogin(this.state.emailId, this.state.password);
                }}>
                <Text
                  style={{ color: '#ffff', fontSize: 18, fontWeight: 'bold' }}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    isVisible: true,
                  });
                }}>
                <Text
                  style={{ color: '#ffff', fontSize: 18, fontWeight: 'bold' }}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '300',
    color: '#ff9800',
    marginTop: 10,
    marginHorizontal: 20,
  },
  quote: {
    fontSize: 25,
    fontWeight: '300',
    color: 'blue',
    marginLeft: 30,
  },
  loginBox: {
    width: 300,
    height: 35,
    borderBottomWidth: 1.5,
    borderColor: '#ffab91',
    fontSize: 20,
    marginBottom: 20,
    marginTop: 5,
  },
  button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#eb0000',
    elevation: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
  },
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: '#ff5722',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
