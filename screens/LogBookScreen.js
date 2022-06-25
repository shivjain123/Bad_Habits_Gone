import React, { Component } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import MyHeader from '../components/MyHeader';
import * as Speech from 'expo-speech';

import firebase from 'firebase';
import db from '../config';

export default class LogBookScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      listOfHabits: [],
      counter: 0,
      goalId: '',
      docId: '',
      timer: 86400000,
      surp: 'you have surpassed your goal.',
    };
    this.requestRef = null;
    console.log(this.state.userId);
  }
  speak = () => {
    var thing = this.state.surp;
    Speech.speak(thing);
  };
  getAllHabits = async () => {
    this.requestRef = db
      .collection('habitDetails')
      .where('userId', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var HabitList = snapshot.docs.map((document) => document.data());
        console.log(HabitList);
        this.setState({
          listOfHabits: HabitList,
          counter: HabitList[0].counter,
        });
      });
  };

  countNumberofPresses = async (goalId) => {
    var docId;

    console.log(this.state.counter + ' ' + 'Database Counter');

    this.setState({
      counter: this.state.counter + 1,
      timer: firebase.firestore.Timestamp.now(),
      goalId: goalId,
    });

    var date = new Date().toLocaleDateString().split('/');
    var splitTimer = date[1];
    console.log(splitTimer);
    console.log(date);

    db.collection('habitDetails')
      .where('goalId', '==', this.state.goalId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((document) => {
          var doc = document.data();
          console.log(doc + '' + 'Doc');
          docId = document.id;
          console.log(docId + '' + 'Id');
          console.log(this.state.counter + ' ' + 'Counter State');
          db.collection('habitDetails').doc(docId).update({
            counter: this.state.counter,
            timer: splitTimer,
          });
        });
      });
    console.log(this.state.listOfHabits[0].limit + ' ' + 'limit');
    if (this.state.counter >= this.state.listOfHabits[0].limit) {
      alert('You have surpassed your goal.');
      this.speak();
    }
  };

  componentDidMount = async () => {
    this.getAllHabits();
  };

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => {
    index.toString();
    console.log(item);
  };

  renderItem = ({ item }) => {
    return (
      <View
        style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <Text style={{ marginHorizontal: 50, marginVertical: 5 }}>
          {' '}
          {item.habitName}{' '}
        </Text>
        <Text style={{ marginHorizontal: 50 }}>
          {' '}
          {'Your Limit is : ' + item.limit}{' '}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'orange',
            marginLeft: 90,
            borderRadius: 15,
            height: 50,
            width: 90,
            marginVertical: 10,
          }}
          onPress={() => {
            this.countNumberofPresses(item.goalId);
          }}>
          <Text style={{ marginTop: 10, marginLeft: 10 }}> Press Me </Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 200 }}>
          {' '}
          {'You have done your bad habit ' + item.counter + ' times.'}{' '}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Log Book" />
        {this.state.listOfHabits.length === 0 ? (
          <Text>No Records Are Available</Text>
        ) : (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.listOfHabits}
            renderItem={this.renderItem}
          />
        )}
      </View>
    );
  }
}
