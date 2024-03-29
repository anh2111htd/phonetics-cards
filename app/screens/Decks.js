import React, { Component } from "react";
import { View, ScrollView, Text, StatusBar, Vibration, Alert, Linking } from 'react-native';
import { List, ListItem, Button, normalize} from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import { splitDue, getDayDiff, BASE_DATE, getPercentOverdue } from '../components/SM2';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const PURPLE='#7f47dd';
const GRAY='#f2f2f2';
const YELLOW='#fbb03b';
const GREEN='#0ec6dc';

class Decks extends Component {

    constructor() {
        super();
        this.state = {
            noteList: [],
            isLoading: true
        };
        this.loadAllDecks = this.loadAllDecks.bind(this);
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`);
    }

    createDir() {
        RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/PhoneticCards`)
            .then(() => {
                // console.log('OK');
            })
            .catch((err) => {
                // console.log('NG');
            })
    }

    listFiles() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/PhoneticCards`);
    }
    
    componentDidMount() {
        this.loadAllDecks();
    }

    loadAllDecks() {
        const TODAY = getDayDiff(BASE_DATE, new Date());
        // console.log(TODAY);
        // console.log(new Date());
        this.listDir(dirs.DocumentDir)
            .then((files) => {
                // Check whether the 'PhoneticCards' folder exist or not.
                const filteredFiles = files.filter((name) => {
                    return name === 'PhoneticCards';
                });
                // If not, create.
                if (filteredFiles.length === 0) {
                    this.createDir();
                } 
                    return this.listFiles();
                
            })
            .then((files) => {
                var contents = new Array(files.length);
                Promise.all(files.map((file, index) => {
                    return fs.readFile(`${dirs.DocumentDir}/PhoneticCards/${file}`, 'utf8')
                        .then((content) => {
                            let contentObject = JSON.parse(content).note;
                            contents[index] = splitDue(contentObject, TODAY)[0];
                        }, (reason) => {
                            // console.log(reason);
                        }).catch(err => {
                            // console.log(err);
                        });
                })).then((values) => {
                    var noteList = files.map((file, index) => {
                        return {
                            fileName: file,
                            keywords: contents[index].slice(0, 3).map((c) => { return c.word; }).join(', '),
                            due: contents[index].length,
                        };
                    });
                    this.setState({
                        noteList: noteList,
                        isLoading: false
                    });
                }, (err) => { console.log(err); }).catch(reason => {
                    console.log(reason);
                });
            })
            .catch((err) => {
                console.log(err);
            });
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
                    backgroundColor={GREEN}
                    barStyle="light-content"
                />
                <View style={styles.textContainer}>
                    <Icon name='md-alarm' size={30}/>
                </View>
                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{borderTopWidth:0, marginTop:0}}>
                        {
                            noteList.map((note) => {
                                return <ListItem
                                            key={note.fileName}
                                            title={note.fileName.slice(0, -5)}
                                            subtitle={note.keywords}
                                            onPress={() => self.handlePressItem(note.fileName)}
                                            containerStyle={styles.containerListItem}
                                            titleStyle={styles.listItemTitleStyle}
                                            leftIcon={{name:'checklist', type:'octicon'}}
                                            leftIconOnPress={() => {Alert.alert(
                                                'Delete',
                                                `Are you sure that you want to delete "${note.fileName.slice(0, -5)}"?`,
                                                [
                                                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                    {text: 'DELETE', onPress: () => {
                                                        fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/PhoneticCards/${note.fileName}`)
                                                            .then(() => {
                                                                this.loadAllDecks();
                                                            })                                                       
                                                    }},
                                                ],
                                            )}}
                                            badge={{ 
                                                    value: note.due, 
                                                    textStyle: { fontWeight:'bold', fontSize:10},
                                                    containerStyle: {
                                                        backgroundColor: YELLOW,
                                                        borderBottomLeftRadius:10,
                                                        borderBottomRightRadius:10,
                                                        borderTopLeftRadius:10,
                                                        borderTopRightRadius:3,
                                                    }}}
                                            hideChevron={true}
                                        />
                            })
                        }
                    </List>
                </ScrollView>
                <ActionButton buttonColor={GREEN}>
                    <ActionButton.Item buttonColor={YELLOW} title="Request features/Give feedback" onPress={() => {Linking.openURL('https://goo.gl/73jgFU');}}>
                        <Icon name="md-mail" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor={GREEN} title="New Deck" onPress={() => this.props.navigation.navigate('Add')}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        );
    }
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: GRAY,
    },
    listContainer: {
        flex: 1,
        backgroundColor: GRAY,
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
        height:35,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight:22, 
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 23,
        color: 'white',
    },
    containerListItem: {
        borderWidth:10,
        borderColor: GRAY,
        borderBottomWidth:0,
    },
    listItemTitleStyle: {
        fontSize:normalize(22),
    }
  });

export default (Decks);