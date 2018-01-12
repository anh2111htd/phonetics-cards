import React, { Component } from "react";
import { View, ScrollView, Text, Linking, TouchableWithoutFeedback, WebView } from 'react-native';
import { List, ListItem, Card, ButtonGroup, Button, Badge, normalize, Header, Icon } from 'react-native-elements';

import { calculate, getDayDiff, getPercentOverdue, BASE_DATE, BEST, CORRECT, WORST, splitDue, splitInSession } from '../components/SM2';

const MAX = 50;
const IN = 0;
const OUT = 1;

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const Heading = ({frequency, fileName, word, selectedIndex, handleDelete}) => (
        <View>
            <View style={styles.textContainer}>
                <Text></Text>
                <Text style={styles.firstText}> Appears {frequency} time(s) in "{fileName.slice(0, -5)}". </Text>
            </View>
            <View style={{margin:0, alignItems:'flex-end'}}>
                <Icon name='delete-forever' 
                    onPress={handleDelete}
                    color='#5c5c5c'
                    containerStyle={{backgroundColor:'#d2d2d2', borderRadius:10}}/>
            </View>            
            <Card
                flexDirection='row'
                wrapperStyle={{justifyContent: 'center'}}>
                <Text style={{color: '#000000', fontSize: normalize(30)}}>
                    {word}
                </Text>
            </Card>
        </View>
);

const eb={element: () => <View><Icon raised name='sentiment-very-satisfied' color={YELLOW}/><Text style={{color:'#ffffff'}} >RECALL ALL</Text></View>};
const gb={element: () => <View><Icon raised name='sentiment-neutral' color={YELLOW}/><Text style={{color:'#ffffff'}} >PARTIALLY</Text></View>};
const hb={element: () => <View><Icon raised name='sentiment-very-dissatisfied' color={YELLOW}/><Text style={{color:'#ffffff'}} >NOTHING</Text></View>};

const PerfButtons = ({phonetic, word, selectedIndex, handlePressAction}) => (
    <View style={styles.buttonArea}>
        <ButtonGroup
            onPress={handlePressAction}
            selectedIndex={selectedIndex}
            // buttons={['EASY', 'GOOD', 'HARD']}
            buttons={[eb, gb, hb]}
            buttonStyle={{backgroundColor: GREEN}}
            containerStyle={styles.buttonContainerStyle}
            selectedBackgroundColor={GREEN}
            textStyle={{color:'#ffffff'}}
            selectedTextStyle={{color:'#ffffff'}}
            component={TouchableWithoutFeedback}
        />
    </View>
);

const ShowButtons = ({handlePressAction, index}) => (
    <View style={styles.buttonArea}>
        <ButtonGroup
            onPress={handlePressAction}
            buttons={[{element: () => <View><Text style={{color:'#ffffff'}} >SHOW ANSWER</Text><Text style={{color:'#ffffff'}}>Progress: {index+1}/{MAX}</Text></View>}]}
            buttonStyle={{backgroundColor: YELLOW}}
            containerStyle={styles.buttonContainerStyle}
            // selectedBackgroundColor={GREEN}
            // textStyle={{color:'#ffffff'}}
            selectedTextStyle={{color:'#ffffff'}}
            component={TouchableWithoutFeedback}
        />
    </View>
);


const Answer = ({phonetic, word, selectedIndex}) => (
    <Card 
        containerStyle={{
            paddingBottom: 0,
            borderBottomColor: GREEN,
            borderBottomWidth: 2,
        }}
        title='ANSWER'
        titleStyle={{color:YELLOW}}>
        <Text>CMU Pronouncing Dictionary (American):</Text>
        <List containerStyle={{borderTopWidth:0, marginTop:5}}>
            {phonetic.map((p, ind) => {
                return <ListItem
                    title={p}
                    leftIcon={
                        <Badge
                            value={ind+1}
                            textStyle={{ 
                                fontWeight:'bold', 
                                fontSize: normalize(12),
                                // color: '#000000',
                            }}
                            containerStyle={{
                                backgroundColor: '#ffe0b6',
                                borderBottomLeftRadius:25,
                                borderBottomRightRadius:25,
                                borderTopLeftRadius:25,
                                borderTopRightRadius:25,
                                height:20,
                                marginRight:10,
                        }}/>
                    }
                    hideChevron={true}
                    titleStyle={{
                        fontSize:normalize(20),
                        fontWeight:'100',
                        color:'#000000'}}
                    containerStyle={{
                        borderBottomWidth:0,
                    }}
                />
            })}
        </List>
        <Text>Look it up,</Text>
        <Button
            title="Oxford Learner's Dictionaries"
            icon={{
                name:'search',
                color:GREEN,
            }}
            onPress={() => Linking.openURL('https://www.oxfordlearnersdictionaries.com/definition/english/'+word)}
            backgroundColor={'#ffffff'}
            textStyle={{
                color:GREEN,
                fontWeight:'bold',
            }}
            containerViewStyle={{
                borderWidth:0,
                marginLeft:0,
                marginRight:0,
                marginBottom:0,
            }}
        />
    </Card>
);


class ShowDeck extends Component {

	constructor() {
		super();
		this.state = {
            isLoading: true,
            hasAnswered: false,
            word: "Loading...",
            phonetic: "",
            selectedIndex: 0,
        }
        this.handlePressAction = this.handlePressAction.bind(this);
        this.handlePressStop = this.handlePressStop.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

	componentDidMount() {
        let TODAY = getDayDiff(BASE_DATE, new Date());
        var self = this;
		filename = this.props.navigation.state.params.filename;
        fs.readFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, 'utf8')
        	.then((content) => {
                let inputCards = JSON.parse(content).note;    
                // console.log(inputCards);
                inputCards = splitInSession(inputCards, TODAY, MAX);
                // console.log(inputCards);
                if (inputCards[IN].length == 0) {
                    this.props.navigation.navigate('Home');
                }
                self.setState({
                    ...this.state,
                    cards: inputCards[IN],
                    leftOver: inputCards[OUT],
                    isLoading: false,
                    word: inputCards[IN][0].word,
                    phonetic: inputCards[IN][0].phonetic,
                    frequency: inputCards[IN][0].frequency,
                    fileName: filename,
                    index: 0,
                    today: TODAY,
                });
            })
            .catch((err) => {
                // console.log(err)
            })
    }
    
    handleDelete() {
        this.state.cards[this.state.index].difficulty = 0;
        this.handlePressAction(0);
    }

    handlePressStop() {
        const { cards, leftOver } = this.state;
        // console.log('hehehhe' + cards);
        // console.log(cards);
        fs.writeFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, JSON.stringify({note: leftOver.concat(cards)}), 'utf8')
                    .catch(err => console.log(err));
    }

    handlePressAction(selectedIndex) {
        const { index, cards } = this.state;
        var performanceRating;
        if (selectedIndex == 0) performanceRating = BEST;
        if (selectedIndex == 1) performanceRating = CORRECT;
        if (selectedIndex == 2) performanceRating = WORST;

        var newCards = cards;
        newCards[index] = calculate(cards[index], performanceRating, this.state.today);

        this.setState({
            ...this.state,
            cards: newCards,
        }, function() {
            var nextIndex = index + 1;
            if (nextIndex >= cards.length) {
                this.handlePressStop();
                this.props.navigation.navigate('Home');
                return;
            }            
            this.setState({
                ...this.state,
                index: nextIndex,
                word: cards[nextIndex].word,
                phonetic: cards[nextIndex].phonetic,
                frequency: cards[nextIndex].frequency,
                hasAnswered:false,
            });
        });
    }

	render() {
		var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }
        // console.log(this.state);
        const { selectedIndex, phonetic, word, fileName, frequency, index } = this.state
        if (!this.state.hasAnswered) {
            return(
                <View style={styles.pageContainer}>
                    <View style={styles.form}>
                        <Heading handleDelete={this.handleDelete} frequency={frequency} phonetic={phonetic} word={word} fileName={fileName} selectedIndex={selectedIndex}/>
                    </View>
                    <ShowButtons index={index} handlePressAction={ () => { this.setState({ ...this.state, hasAnswered: true, }); }}/>
                </View>
            );
        } else {
            return (
            <View style={styles.pageContainer}>
                <View style={styles.form}>
                    <Heading handleDelete={this.handleDelete} frequency={frequency} phonetic={phonetic} word={word} fileName={fileName} selectedIndex={selectedIndex}/>
                    <Answer phonetic={phonetic} word={word} selectedIndex={selectedIndex}/>
                </View>
                <PerfButtons phonetic={phonetic} word={word} selectedIndex={selectedIndex} handlePressAction={this.handlePressAction}/>
            </View>
            );
        }
	}
}

const PURPLE='#7f47dd';
const GRAY='#f2f2f2';
const YELLOW='#fbb03b';
const GREEN='#0ec6dc';

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
      backgroundColor:GREEN,
    },
    buttonContainerStyle: {
        marginBottom: 0,
        marginRight:0,
        marginLeft:0,
        borderWidth:0,
        borderRadius:0,
        height:100,
    },
    innerBorderStyle: {
      // borderWidth: 0,
      color: '#000',
    },
    firstText: {
      color: '#000000',
      fontSize: normalize(15),
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

export default (ShowDeck);