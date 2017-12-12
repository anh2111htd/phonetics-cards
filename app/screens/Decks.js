import React, { Component } from "react";
import { View } from 'react-native';
import { List, ListItem } from 'react-native-elements';


import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs


class Decks extends Component {

    constructor() {
        super();
        this.state = {
            noteList: "initial_noteList",
            isLoading: true
        };
        this.SetState = this.SetState.bind(this);
        this.listDir = this.listDir.bind(this);
        this.listFiles = this.listFiles.bind(this);
        this.listFilesAndSetState = this.listFilesAndSetState.bind(this);
        this.createDir = this.createDir.bind(this);
        this.createNewNote = this.createNewNote.bind(this);
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`);
    }

    createDir() {
        RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/PhoneticCards`)
            .then(() => {
                console.log('OK');
            })
            .catch((err) => {
                console.log('NG');
            })
    }

    listFiles() {
        // console.log(RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`));
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`);
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

    SetState(files) {
        // console.log("Set State");
        // console.log(files);
        this.state.noteList = files;
        // console.log("2 " + this.state);
    }

    saveResultToAsyncStorage = async (files) => {
        try {
          await AsyncStorage.setItem('TempResult', files);
        } catch (error) {
          // Error saving data
        }
    }

    componentWillMount() {
        var self = this;
        // this.setState({ 
        //     test: 1
        // })
        // console.log("1 " + this.state.test);
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
            // console.log("CS here");
            // console.log(files);  
            // this.SetState(files);
            self.setState({
                noteList: files,
                isLoading: false
            })
            // const filteredFiles = files
            // .filter((name) => {
            //     return name.endsWith('.md')
            // })
            // Check whether the folder has any note files or not.
            // if (filteredFiles.length === 0) {
                // If not, create.
                // this.createNewNote(`${makeRandomHex()}.md`)
            // }
            // return this.listFilesAndSetState()
        }).then(() => {
            // console.log("done");
            // console.log(this.state);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {
        // const noteListFixed  = ["anh.md", "anh85.59845634166037.md", "anh99.17384334270601.md", "anh51.21224621338807.md", "anh77.0975620258701.md", "anh6.7828793500880336.md", "anh21.646129549909986.md", "anh80.17619733354091.md", "anh78.71853021943662.md", "anh86.08889477750921.md", "anh28.313982960422003.md", "anh71.72000598842159.md", "anh38.97834957808324.md", "anh52.4220669463634.md", "anh27.413795927101624.md", "anh60.67174196347849.md", "anh15.728105793888968.md"];
        // this.state.noteList = noteListFixed;
        var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View></View>
            )
        } 
        const something = this.state.noteList;
        console.log(something);
        return (
            <List>
                { 
                    something.map((note) => {
                        return <ListItem title={note} />
                    })
                }
            </List>
        );
    }
}

export default (Decks);