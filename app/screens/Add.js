import React, { Component } from "react";
import { Text, AsyncStorage, View, StatusBar, Platform, Linking, TextInput, Button } from 'react-native';
import { ButtonGroup, Card } from 'react-native-elements';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

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
    buttonRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    buttonStyle: {
      backgroundColor:'#7f47dd',
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
    var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
        words = cleanString.split(' '),
        frequencies = {},
        word, frequency, i;
    for( i=0; i<words.length; i++ ) {
      word = words[i].toLowerCase();
      if (word.length <= 3) continue;
      frequencies[word] = frequencies[word] || 0;
      frequencies[word]++;
    }
    return Object.keys(frequencies);
  }

  mapPhoneticTranslation(word) {
    return {
      "word": word,
      "phonetic": `https://www.oxfordlearnersdictionaries.com/definition/english/${word}`
    };
  }

  addSuperMemo(wordInJson) {
    return {
      ...wordInJson,
      "nth": 0,
      "lastInterval": "0",
      "EF": "0",
    }
  }

  createNewDeck= () => {
    const dummy_array_json =
    {
      note:
        [
          {
            "word": "Hello",
            "phonetic": "/həˈloʊ",
            "nth": "0",
            "lastInterval": "0",
            "EF": "0",
          },
          {
            "word": "llo",
            "phonetic": "/loʊ",
            "nth": "0",
            "lastInterval": "0",
            "EF": "0",
          },
        ],
    }
    while (this.state.waiting);
    var self = this;
    const jsonArray = {
                        note:
                        this.getListofUniqueWords(this.state.rawText)
                          .map(
                            function(word) {
                              return self.addSuperMemo(self.mapPhoneticTranslation(word));
                            })
                      };
    var currentdate = new Date();
    var datetime =  currentdate.getDate() + "_"
                    + (currentdate.getMonth()+1)  + "_"
                    + currentdate.getHours() + "_"
                    + currentdate.getMinutes() + "_"
                    + currentdate.getMilliseconds();
    const newFileName = `add${datetime}.json`;
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
            <Text style={styles.firstText}> Create new deck </Text>
          </View>
          <Card>
            <Text>Paste the text first</Text>
            <TextInput 
              onChangeText={(text) => this.setState({waiting: false, rawText: text})} 
              selectionColor='#0ec6dc'
              underlineColorAndroid='#0ec6dc'
            />
            {/* <View style={{flexDirection: 'row'}}> */}
            <Text>Give it a short name</Text> 
            <TextInput 
              onChangeText={(text) => this.setState({waiting: false, name: text})} 
              selectionColor='#0ec6dc'
              underlineColorAndroid='#0ec6dc'
            />
            {/* </View> */}
            <Text>There you go!</Text>
          </Card>
        </View>
        <ButtonGroup
          onPress={this.handlePress}
          selectedIndex={selectedIndex}
          buttons={buttons}
          buttonStyle={styles.buttonStyle}
          textStyle={{color:'#ffffff'}}
          selectedTextStyle={{color:'#ffffff'}}
          />
      </View>
    );
  }
}

export default (Add);