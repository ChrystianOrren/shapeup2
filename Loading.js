import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';

const Loading = () => {


    return (
        <ImageBackground source={require('./assets/images/loadingBgP.png')} style={styles.bg} resizeMode='contain'>
            <Text></Text>
        </ImageBackground> 
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: 'center', // Align content vertically at the center
        alignItems: 'center',
        backgroundColor: '#FFB2E6'
    },
});

export default Loading;