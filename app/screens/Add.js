import React, { Component } from "react";
import { AsyncStorage, View, StatusBar, Platform, Linking, TextInput, Button } from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

class Add extends Component {

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

  createNewDeck() {
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
    fs.writeFile(`${dirs.DocumentDir}/PhoneticCards/${newFileName}`, JSON.stringify(dummy_array_json), 'utf8')
                    .catch(err => console.log(err));
  }

  render() {
    return (
        <View>
          <Button
            onPress={this.createNewDeck}
            title="Create new json file"
          />
        </View>
    );
  }
}

export default (Add);