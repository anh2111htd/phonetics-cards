import { StackNavigator } from 'react-navigation';

import Home from '../screens/Home';
import Decks from '../screens/Decks';
import Add from '../screens/Add';
import ShowDeck from  '../screens/ShowDeck';

const HomeStack = StackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                headerTitle: 'Home',
            },
        },
        Decks: {
            screen: Decks,
            navigationOptions: {
                headerTitle: 'Decks',
            },
        },
        ShowDeck: {
            screen: ShowDeck,
            navigationOptions: {
                headerTitle: 'ShowDeck',
            },
        },
        Add: {
            screen: Add,
            navigationOptions: {
                headerTitle: 'Add',
            },
        }
    },
    {
        headerMode: 'screen',
    }
);

export default StackNavigator(
    {
        Home: {
            screen: HomeStack,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
        // cardStyle: { paddingTop: StatusBar.currentHeight },
    },
);
