import React, { Component } from "react";
import { View, ScrollView, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';


import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

class ShowDeck extends Component {

	constructor() {
		super();
		this.state = {
			isLoading: true
		}
	}

	componentWillMount() {
        var self = this;
		filename = this.props.navigation.state.params.filename;
        fs.readFile(`${dirs.DocumentDir}/PhoneticCards/${filename}`, 'utf8')
        	.then((content) => {
                let contentObject = JSON.parse(content)
                self.setState({
                	isLoading: false,
                	content: contentObject.note
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

	render() {
		var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }

        var content = this.state.content[0].word;
		return (
			<View>
				<Text>
					{content}
				</Text>
			</View>
		);
	}
}

export default (ShowDeck);