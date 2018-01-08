//TODO: add same name notifi cation
//empty text
import React, { Component } from "react";
import { CheckBox, Text, AsyncStorage, View, StatusBar, Platform, Linking, TextInput, Button } from 'react-native';
import { ButtonGroup, Card} from 'react-native-elements';
import { BASE_DATE, getDayDiff } from '../components/SM2'

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const TODAY = getDayDiff(BASE_DATE, new Date());
const dict = require('../components/cmu_dict.json');

class Add extends Component {
  constructor() {
    super();
    this.state = {
      waiting: true,
      selectedIndex: 0, 
    };
    this.handlePress = this.handlePress.bind(this)
  }

  listDir() {
    return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`)
  }

  createDir() {
    RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/PhoneticCards`)
        .then(() => {
            console.log('OK')
        })
        .catch((err) => {
            console.log('NG')
        })
  }

  listFiles() {
    console.log(RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`));
    return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`)
  }
  
  componentWillMount() {
    this.listDir(dirs.DocumentDir)
      .then((files) => {
          // Check whether the 'PhoneticCards' folder exist or not.
          const filteredFiles = files.filter((name) => {
              return name === 'PhoneticCards'
          })
          // If not, create.
          if (filteredFiles.length === 0) {
              this.createDir()
          }
          return this.listFiles()
      })
      .catch((err) => {
          console.log(err)
      })
  }

  getListofUniqueWords(string) {
    var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()"\n?]/g," "),
        words = cleanString.split(' '),
        frequencies = {},
        word, frequency, i;
    for( i=0; i<words.length; i++ ) {
      word = words[i].toLowerCase();
      if (word.length <= 3) continue;
      frequencies[word] = frequencies[word] || 0;
      frequencies[word]++;
    }
    console.log(frequencies);
    return Object.keys(frequencies).map(function(key) {
      return {
        word: key,
        frequency: frequencies[key],
      }
    })
  }

  getPhonetic(str) {
    var res = [];
    if (dict.hasOwnProperty(str)){
      res.push(dict[str]);
    } 
    if (dict.hasOwnProperty(str+'(1)')){
      res.push(dict[str+'(1)']);
    } 
    if (dict.hasOwnProperty(str+'(2)')){
      res.push(dict[str+'(2)']);
    } 
    if (dict.hasOwnProperty(str+'(3)')){
      res.push(dict[str+'(3)']);
    }
    return res;
  }

  mapPhoneticTranslation(wordFreq) {
    return {
      ...wordFreq,
      "phonetic": this.getPhonetic(wordFreq.word),
    };
  }

  addSuperMemo(wordInJson) {
    return {
      ...wordInJson,
      difficulty: 0.3,
      interval: 1,
      dueDate: TODAY,
      update: TODAY - 1,
    }
  }

  createNewDeck= () => {
    while (this.state.waiting);
    var self = this;
    const jsonArray = {
                        note:
                          this.getListofUniqueWords(this.state.rawText)
                            .map(
                              function(word) {
                                return self.addSuperMemo(self.mapPhoneticTranslation(word));
                              }),
                      };
    const newFileName = this.state.name + '.json';
    // Create a real file
    fs.createFile(`${dirs.DocumentDir}/PhoneticCards/${newFileName}`, '', 'utf8')
        .catch((err) => {
            console.log(err)
        });
    fs.writeFile(`${dirs.DocumentDir}/PhoneticCards/${newFileName}`, JSON.stringify(jsonArray), 'utf8')
                    .catch(err => console.log(err));
  }

  handlePress (selectedIndex) {
    if (selectedIndex == 1) {
      this.createNewDeck();
    }
    this.props.navigation.navigate('Home');
  }
  
  render() {
    const buttons = ['Cancel', 'OK']
    const { selectedIndex } = this.state

    return (
      <View style={styles.pageContainer}>
        <View style={styles.form}>
          <View style={styles.textContainer}>
            <Text></Text>
            <Text style={styles.firstText}> Create a new Deck </Text>
          </View>
          <Card>
            <Text>Paste your text here</Text>
            <TextInput 
              onChangeText={(text) => this.setState({...this.state, rawText: text})} 
              selectionColor={YELLOW}
              underlineColorAndroid={YELLOW}
            />
            <Text>Give it a short name</Text> 
            <TextInput 
              onChangeText={(text) => this.setState({...this.state, waiting: false, name: text})} 
              selectionColor={YELLOW}
              underlineColorAndroid={YELLOW}
            />
          </Card>
        </View>
        <ButtonGroup
          onPress={this.handlePress}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={styles.buttonStyle}
          textStyle={{color:'#ffffff'}}
          selectedTextStyle={{color:'#ffffff'}}
          containerStyle={{
                            marginBottom: 0,
                            marginRight:0,
                            marginLeft:0,
                            borderWidth:0,
                            borderRadius:0,
                          }} 
          />
      </View>
    );
  }
}

const PURPLE='#7f47dd';
const GRAY='#f2f2f2';
const YELLOW='#fbb03b';
const GREEN='#0ec6dc';

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
    },
    form: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    buttonArea: {
      flex: 1, 
      justifyContent: 'flex-end',
    },
    row: {
      flex: 1, 
      flexDirection: 'row'
    },
    buttonRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    buttonStyle: {
      backgroundColor:GREEN,
    },
    innerBorderStyle: {
      // borderWidth: 0,
      color: '#000',
    },
    firstText: {
      color: '#000000',
      fontSize: 15,
      fontWeight: '300',     
      borderBottomWidth: 0,  
    },
    textContainer: {
      // flex: 1,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center', 
    },
  });


export default (Add);