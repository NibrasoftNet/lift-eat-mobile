import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, StatusBar } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
    <View style={[styles.container, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
    <View style={[styles.container, { backgroundColor: '#673ab7' }]} />
);


const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

const routes = [
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
];

export default function Meals() {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: StatusBar.currentHeight,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
});
