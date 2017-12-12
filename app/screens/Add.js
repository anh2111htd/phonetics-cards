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

  async listFilesAndSetState() {
    const files = await this.listFiles()
    const filteredFiles = files.filter((name) => {
        return name.endsWith('.md')
    })

    // let settingJsonFile = await fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')

    // Change file name to object of file name and one liner content
    let fileList = []
    for (let i = 0; i < filteredFiles.length; i++) {
        const fileName = filteredFiles[i]
        const content = await fs.readFile(`${dirs.DocumentDir}/PhoneticCards/${fileName}`, 'utf8')
        let filteredSettingFile = JSON.parse(settingJsonFile).note.filter(setting => {
            return setting.name === fileName
        })[0]
        fileList.push({
            fileName: fileName,
            content: content === '' ? 'Tap here and write something!' : content.split(/\r\n|\r|\n/)[0],
            createdAt: filteredSettingFile.createdAt,
            isStarred: filteredSettingFile.isStarred
        })
    }
    fileList.sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
    })

    this.setState({
        noteList: fileList,
    })
  }

  createNewNote = () => { //fileName, isOpen) {
    // const newFileName = fileName === '' ? `${makeRandomHex()}.md` : fileName
    const newFileName = `anh${Math.random() * 100}.md`;
    console.log("hi");
    // Create a real file
    fs.createFile(`${dirs.DocumentDir}/PhoneticCards/${newFileName}`, '', 'utf8')
        .then((file) => {
            this.setState({
                // isNoteOpen: isOpen,
                fileName: newFileName,
                content: ''
            })
            // Update setting file
            // return fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')
        })
        .then((content) => {
            // let contentObject = JSON.parse(content)
            // const date = new Date()
            // const thisNote = {
            //     "type": MARKDOWN_NOTE,
            //     "folder": DEFAULT_FOLDER,
            //     "title": "",
            //     "name": newFileName,
            //     "isStarred": false,
            //     "createdAt": date,
            //     "updatedAt": date
            // }
            // contentObject.note.push(thisNote)
            // console.table(contentObject.note)
            // fs.writeFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(contentObject), 'utf8')
            //     .catch(err => console.log(err))
            // AwsMobileAnalyticsConfig.recordDynamicCustomEvent('CREATE_NOTE')
            console.log("hi");
        })
        .catch((err) => {
            console.log(err)
        })
    console.log("hi");
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
      // .then((files) => {
          // const filteredFiles = files.filter((name) => {
          //     return name === 'boostnote.json'
          // })
          // // Check whether the folder has a setting file or not.
          // if (filteredFiles.length === 0) {
          //     // If not, create.
          //     const defaultJson = {
          //         note: []
          //     }
          //     fs.createFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(defaultJson), 'utf8')
          //         .catch(err => console.log(err))
          // }
          // return this.listFiles()
      // })
      .then((files) => {
          const filteredFiles = files.filter((name) => {
              return name.endsWith('.md')
          })
          // Check whether the folder has any note files or not.
          if (filteredFiles.length === 0) {
              // If not, create.
              // this.createNewNote(`${makeRandomHex()}.md`)
          }
          return this.listFilesAndSetState()
      })
      .catch((err) => {
          console.log(err)
      })
  }

    handlePressSubmit = async () => {
        try {
          await AsyncStorage.setItem('@Input:user_input', this.state.content);
        } catch (error) {
          // Error saving data
        }
        const stored_value = await AsyncStorage.getItem('@Input:user_input');
        console.log(stored_value);
    }

    render() {
        // const { noteList, mode, filterFavorites, isNoteOpen, fileName, content } = this.state 
        return (
            <View>
                {/* .map((note) => {
                                if (filterFavorites &&  !note.isStarred) return null
                                return <NoteListItem note={note} onStarPress={this.onStarPress} onNotePress={this.setNoteModalIsOpen} key={note.fileName} />
                            }) */}
                <TextInput {...this.props} onChangeText={(text) => this.setState({content:text})} />                
                <Button
                    onPress={this.createNewNote}
                    title="Submit"
                    color="#841584"
                />
            </View>
        );
    }
}

export default (Add);