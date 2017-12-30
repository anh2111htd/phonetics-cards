import { StackNavigator, navigationOptions } from 'react-navigation';

import Home from '../screens/Home';
import Decks from '../screens/Decks';
import Add from '../screens/Add';
import ShowDeck from  '../screens/ShowDeck';

const HomeStack = StackNavigator(
    {
        // Home: {
        //     screen: Home,
        //     navigationOptions: {
        //         headerTitle: 'Home',
        //     },
        // },
        Home: {
            screen: Decks,
            navigationOptions: {
                header: null,
            },
        },
        ShowDeck: {
            screen: ShowDeck,
            navigationOptions: {
                header: null,
            },
        },
        Add: {
            screen: Add,
            navigationOptions: {
                header: null,
            },
        }
    },
    // {
    //     headerMode: 'screen',
    // },
    {
        navigationOptions: { header: null}  
    }
);

export default StackNavigator(
    {
        Home: {
            screen: HomeStack,
        },
    }, //
    
    
    {
        mode: 'modal',
        headerMode: 'none',
    //     // cardStyle: { paddingTop: StatusBar.currentHeight },
    },
);
