import { StackNavigator } from 'react-navigation';

import Home from '../screens/Home';
import Decks from '../screens/Decks';
import Add from '../screens/Add';

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
