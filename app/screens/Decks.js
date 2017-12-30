import React, { Component } from "react";
import { View, ScrollView, Text, StatusBar } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        borderTopWidth: 0,  
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
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    containerListItem: {
        borderWidth:5,
        borderColor: '#f2f2f2',
        backgroundColor:'#ffffff',
        borderBottomWidth:0,  
    },
  });

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
            <View style={styles.pageContainer}>
                <StatusBar
                    backgroundColor='#7f47dd'
                    barStyle="light-content"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.firstText}> </Text>
                    <Text style={styles.firstText}>Some cards due</Text>
                </View>
                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{borderTopWidth:0}}>
                        {
                            noteList.map((note) => {
                                return <ListItem
                                            title={note}
                                            key={note}
                                            raised
                                            containerStyle={styles.containerListItem}
                                            onPress={() => self.handlePressItem(note)}
                                            badge={ { value: 100, textStyle: { color: '#0ec6dc', textDecorationLine: 'underline', }, containerStyle: { backgroundColor: '#ffffff', borderWidth:0 }}}
                                            chevronColor='#0ec6dc'
                                            //hideChevron={true}
                                            // rightIcon={<Text style={styles.dueToday}>100</Text>}
                                        />
                            })
                        }
                    </List>
                </ScrollView>
                <ActionButton buttonColor='#7f47dd' title="New Deck" onPress={() => this.props.navigation.navigate('Add')}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton>
            </View>
        );
    }
}

export default (Decks);