import React, { Component } from "react";
import { View } from 'react-native';
import { ListItem, List } from 'react-native-elements';
import { Icon } from 'react-native-elements'

class Home extends Component {

    handleAddPress = () => {
        this.props.navigation.navigate('Add');
    }

    handleDecksPress = () => {
        this.props.navigation.navigate('Decks');
    }

    render() {
        return (
            <List>
                <ListItem
                    onPress={this.handleDecksPress}
                    title="Decks"
                />
                <ListItem
                    onPress={this.handleAddPress}
                    title="Add"
                />
            </List>
        );
    }
}

export default (Home);