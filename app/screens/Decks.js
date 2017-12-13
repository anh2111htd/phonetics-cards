import React, { Component } from "react";
import { View, ScrollView, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';


import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs


class Decks extends Component {

    constructor() {
        super();
        this.state = {
            noteList: [],
            isLoading: true
        };
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
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`);
    }

    componentWillMount() {
        var self = this;
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
        .then((files) => {
            self.setState({
                noteList: files,
                isLoading: false
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    handlePressItem(filename) {
        this.props.navigation.navigate('ShowDeck', { filename: filename });
    }

    render() {
        var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }

        var noteList = this.state.noteList;
        var self = this;
        return (
            <ScrollView>
                <List>
                    {
                        noteList.map((note) => {
                            return <ListItem
                                        title={note}
                                        onPress={() => self.handlePressItem(note)}
                                    />
                        })
                    }
                </List>
            </ScrollView>
        );
    }
}

export default (Decks);