import React, { Component } from "react";
import { View, ScrollView, Text, Linking, Button } from 'react-native';
import { List, ListItem, Card, ButtonGroup } from 'react-native-elements';


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

class ShowDeck extends Component {

	constructor() {
		super();
		this.state = {
			isLoading: true,
            word: "Loading...",
            phonetic: "",
            selectedIndex: 0,
        }
        this.handlePressAction = this.handlePressAction.bind(this);
        this.handlePressStop = this.handlePressStop.bind(this);
	}

	componentWillMount() {
        var self = this;
		filename = this.props.navigation.state.params.filename;
        fs.readFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, 'utf8')
        	.then((content) => {
                let contentObject = JSON.parse(content).note
                console.log(contentObject);
                var countOne = 0;
                var firstPos;
                for (var i = contentObject.length-1; i>=0; i--) {
                    if (contentObject[i].nth == 0) {
                        firstPos = i;
                    } else {
                        countOne+=1;
                    }
                }
                self.setState({
                    ...this.state,
                	isLoading: false,
                	cards: contentObject,
                    index: firstPos,
                    word: contentObject[firstPos].word,
                    phonetic: contentObject[firstPos].phonetic,
                    countOne: countOne
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePressStop() {
        const { cards } = this.state;
        console.log(cards);
        fs.writeFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, JSON.stringify({note: cards}), 'utf8')
                    .catch(err => console.log(err));
    }

    handlePressAction(selectedIndex) {
        if (selectedIndex == 0) {
            this.handlePressStop();
            this.props.navigation.navigate('Home');
            return;
        }
        const isNext = (selectedIndex == 2) ? 1 : 0;
        const { index, cards, countOne } = this.state;

        if (countOne >= cards.length) {
            this.handlePressStop();
            this.props.navigation.navigate('Home');
            return;
        }

        var nextIndex = (index + 1) % cards.length;
        while (cards[nextIndex].nth == 1) nextIndex = (nextIndex + 1)% cards.length;

        var newCards = cards;
        newCards[index] = {
            ...newCards[index],
            nth: isNext
        }

        console.log(newCards);
        this.setState({
            ...this.state,
            index: nextIndex,
            word: cards[nextIndex].word,
            phonetic: cards[nextIndex].phonetic,
            cards: newCards,
            countOne: countOne+isNext
        });
    }

	render() {
		var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }
        const buttons = ['Stop', 'Again', 'Next']
        const { selectedIndex } = this.state

        return (
            <View style={styles.pageContainer}>
            <View style={styles.form}>
            <View style={styles.textContainer}>
                <Text></Text>
                <Text style={styles.firstText}> This word appears sometime in your text. </Text>
            </View>
            <Card>
                <Text style={{color: '#000000', fontSize: 50}}
                      onPress={() => Linking.openURL(this.state.phonetic)}>
                    {this.state.word}
                </Text>
            </Card>
            </View>
            <ButtonGroup
                onPress={this.handlePressAction}
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

export default (ShowDeck);