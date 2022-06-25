import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import MyHeader from '../components/MyHeader';

import firebase from 'firebase';
import db from '../config';

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      habitName: '',
      count: '',
      limit: '',
      userDocId: '',
      IsGoalActive: false,
    };
  }

  createGoalId = () => {
    return Math.random().toString(36).substring(7);
  };

  addGoals = async () => {
    var goalId = this.createGoalId();
    this.setState({
      goalId: goalId,
    });
    await db.collection('habitDetails').add({
      userId: this.state.userId,
      habitName: this.state.habitName,
      count: parseInt(this.state.count),
      limit: parseInt(this.state.limit),
      date: firebase.firestore.Timestamp.now(),
      goalId: goalId,
      counter: 0,
    });

    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isGoalActive: true,
          });
        });
      });

    this.setState({
      habitName: '',
      count: '',
      limit: '',
    });

    alert('The Goal has been added.');
  };

  getIsGoalActive() {
    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsGoalActive: doc.data().isGoalActive,
            userDocId: doc.id,
          });
          console.log(this.state.IsGoalActive + ' ' + 'Goal');
          console.log(this.state.userDocId);
        });
      });
  }

  componentDidMount = async () => {
    this.getIsGoalActive();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Bad Habit Tracker" />
        <TextInput
          style={styles.textInput}
          placeholder={'Name of Bad Habit'}
          onChangeText={(text) => {
            this.setState({
              habitName: text,
            });
          }}
          value={this.state.habitName}
        />
        <TextInput
          style={styles.textInput}
          placeholder={'No. of times you do it per day'}
          keyboardType={'numeric'}
          onChangeText={(text) => {
            this.setState({
              count: text,
            });
          }}
          value={this.state.count}
        />
        <TextInput
          style={styles.textInput}
          placeholder={'Daily Goal'}
          keyboardType={'numeric'}
          onChangeText={(text) => {
            this.setState({
              limit: text,
            });
          }}
          value={this.state.limit}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addGoals();
            }}>
            <Text style={{ fontSize: 22 }}> Set Goal </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'red',
              marginLeft: 30,
              marginTop: 30,
              fontSize: 20,
            }}>
            {' '}
            A Notification will be sent to you as soon as you excede your daily
            limit.{' '}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#ffab91',
    borderWidth: 3,
    backgroundColor: '#ffff',
    marginLeft: 60,
  },
  buttonContainer: {
    flex: 1,
    marginVertical: 50,
  },
  textInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
});
