import React, { Component } from "react";
import { AsyncStorage, View, StatusBar, Platform, Linking, TextInput, Button } from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

class Add extends Component {

  constructor() {
    super();
    this.state = {
      waiting: true
    };
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
      "phonetic": word
    };
  }

  addSuperMemo(wordInJson) {
    return {
      ...wordInJson,
      "nth": "0",
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

  render() {
    return (
        <View>
          <TextInput onChangeText={(text) => this.setState({waiting: false, rawText: text})} />
          <Button
            onPress={this.createNewDeck}
            title="Create new json file"
          />
        </View>
    );
  }
}

export default (Add);