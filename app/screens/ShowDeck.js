import React, { Component } from "react";
import { View, ScrollView, Text, Linking, Button } from 'react-native';
import { List, ListItem } from 'react-native-elements';


import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

class ShowDeck extends Component {

	constructor() {
		super();
		this.state = {
			isLoading: true,
            word: "Loading...",
            phonetic: ""
		}
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

    handlePressStop = () => {
        const { cards } = this.state;
        console.log(cards);
        fs.writeFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, JSON.stringify({note: cards}), 'utf8')
                    .catch(err => console.log(err))
    }

    handlePressAction(isNext) {
        const { index, cards, countOne } = this.state;

        if (countOne >= cards.length) return this.handlePressStop;

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

		return (
			<View>
                <Text style={{color: 'blue', fontSize: 50}}
                      onPress={() => Linking.openURL(this.state.phonetic)}>
                    {this.state.word}
                </Text>
                <Text> _ </Text>
                <Button
                    onPress={() => this.handlePressAction(1)}
                    title="Next"
                    style={{padding: 10}}
                />
                <Text> _ </Text>
                <Button
                    onPress={() => this.handlePressAction(0)}
                    title="Again"
                    style={{padding: 10}}
                />
                <Text> _ </Text>
                <Button
                    onPress={this.handlePressStop}
                    title="Stop"
                    style={{padding: 10}}
                />
			</View>
		);
	}
}

export default (ShowDeck);