import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, TextInput, FlatList, Image, Keyboard } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const storage = new Storage({
    // Maximum capacity, default is 1000
    size: 1000,
    // Data expire time, default is null, never expires
    defaultExpires: null,
    // Cache data, default is true
    enableCache: true,
    // Storage system for data, default is AsyncStorage
    storageBackend: AsyncStorage,
});

// Save data to storage
const saveData = async (key, data) => {
    try {
      await storage.save({
        key: key,
        data: data,
      });
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
};

const CreateBoard = () => {
    {/* UseStates */}
    const [name, setName] = React.useState('');
    const [lengFt, setLenFt] = useState('');
    const [lenIn, setLenIn] = useState('');
    const [widIn, setWidin] = useState('');
    const [tail, setTail] = useState('');
    const [err1, setErr1] = useState(false);
    const [err2, setErr2] = useState(false);
    const [err3, setErr3] = useState(false);
    const [err4, setErr4] = useState(false);
    const [suc, setSuc] = useState(false);

    const possibleFts = [4,5,6,7,8,9,10,11,12];
    const possibleIns = [0,1,2,3,4,5,6,7,8,9,10,11];
    const possibleWids = [15,16,17,18,19,20,21,22,23,24,25];

    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    // Listen for keyboard events
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardOpen(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardOpen(false);
        });

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    {/* Check Variables */}
    useEffect(() => {
        if (name != '' && lengFt != '' && lenIn != '' && widIn != '' && tail != '') {
            setErr1(false);
        }  

        //Check Proper Lengths
        const checkFt = possibleFts.includes(parseInt(lengFt));
        const checkIn = possibleIns.includes(parseInt(lenIn));
        if ((lengFt == '' && lenIn == '') || (checkFt && checkIn)) {
            setErr2(false);
        }
        else {
            setErr2(true);
        }

        //Check proper Widths
        const checkWid = possibleWids.includes(parseInt(widIn));
        if (widIn == '' || checkWid) {
            setErr3(false);
        } else {
            setErr3(true);
        }

    }, [name, lengFt, lenIn, widIn, tail]);

    {/* Surfboard Data */}
    const tailShapes = [
        { id: '1', title: 'Standard', imgUrl: require('./assets/images/StandardTail.png') },
        { id: '2', title: 'Diamond', imgUrl: require('./assets/images/DiamondTail.png') },
        { id: '3', title: 'Pin', imgUrl: require('./assets/images/PinTail.png') },
        { id: '4', title: 'Swallow', imgUrl: require('./assets/images/SwallowTail.png') },
        { id: '5', title: 'Fish', imgUrl: require('./assets/images/FishTail.png') },
        { id: '6', title: 'Moon', imgUrl: require('./assets/images/MoonTail.png') },
      ];
    const surfboardLengthOptions = [];
    for (let feet = 5; feet <= 10; feet++) {
        const option = {
            label: `${feet}'`,
            value: `option${feet}`,
        };
        surfboardLengthOptions.push(option);
        for (let inches = 1; inches <= 12; inches++) {
            const option = {
                label: `${feet}'${inches}`,
                value: `option${feet}-${inches}`,
            };
            surfboardLengthOptions.push(option);
        }
    }
    const surfboardWidthOptions = [];
    for (let feet = 15; feet <= 25; feet++) {
        const option = {
            label: `${feet}'`,
            value: `option${feet}`,
        };
        surfboardWidthOptions.push(option);
        for (let inches = 1; inches <= 12; inches++) {
            const option = {
                label: `${feet}'${inches}`,
                value: `option${feet}-${inches}`,
            };
            surfboardWidthOptions.push(option);
        }
    }

    //Object for each tail shape
    const tailItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.tailItem, item.title === tail && styles.selectedTailItem]}
            onPress={() => pressTailShape(item.title)}
        >
            <Image source={item.imgUrl} style={styles.tailImage} resizeMode='cover'/> 
            <Text style={{ fontFamily: 'ShareTech-Regular', fontSize: 15, marginTop: 5 }}>{item.title}</Text>
        </TouchableOpacity>
    );

    {/* Navigation */}
    const navigation = useNavigation();

    {/* Functions */}
    const resetData = () => {
        setName('');
        setLenFt('');
        setLenIn('');
        setWidin('');
        setTail('');
    }

    const goBack = () => {
        resetData();
        navigation.goBack();
    }

    const pressTailShape = (tailShape) => {
        setTail(tailShape);
    }

    const pressCreateBoard = async () => {

        const allKeys = await AsyncStorage.getAllKeys();

        if (allKeys.includes(name)) {
            console.log(`${name} is in the keys.`);
            setErr4(true);
            return
        }
        else{
            setErr4(false);
        }
        
        if (name == '' || lengFt == '' || lenIn == '' || widIn == '' || tail == ''){
            console.log("must enter all fields");
            setErr1(!err1);
        }
        else{
            try {
                // Serialize the data into a JSON string
                const data = JSON.stringify({ lengFt, lenIn, widIn, tail });
            
                // Save the data to AsyncStorage with the name as the key
                await saveData(name, data);
            
                console.log('Data saved successfully!');
                setSuc(true);
                resetData();
                let board = [name, lengFt, lenIn, widIn, tail]
                navigation.navigate('Design', { data: board });
        
            } catch (error) {
                console.error('Error saving data:', error);
            }
        }
    }

  return (
    <SafeAreaView style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
            <FontAwesome5 name="arrow-left" size={30} color="#FFB2E6" />
        </TouchableOpacity>

        <Text style={styles.createText}>Creating board...</Text>

        <View style={styles.boardData} >
            <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Name"
                placeholderTextColor={'#FFB2E6'}
            />

            <View style={styles.dimView}>
                <Text style={styles.dimText}>Length:</Text>
                <TextInput
                    style={styles.dimInput}
                    onChangeText={setLenFt}
                    value={lengFt}
                    placeholder="ft."
                    keyboardType="numeric"
                    placeholderTextColor={'#FFB2E6'}
                />
                <Text style={styles.dimText}>feet</Text>
                <TextInput
                    style={styles.dimInput}
                    onChangeText={setLenIn}
                    value={lenIn}
                    placeholder="in."
                    keyboardType="numeric"
                    placeholderTextColor={'#FFB2E6'}
                />
                <Text style={styles.dimText}>inches</Text>
            </View>

            { err2 ? 
            (<Text style={styles.err1Txt}>*Must be proper measurement. (4-12 ft)(0-11 in)*</Text>) 
                : 
            (<></>) 
        }

            <View style={styles.dimView}>
                <Text style={styles.dimText}>Width:</Text>
                <TextInput
                    style={styles.dimInput}
                    onChangeText={setWidin}
                    value={widIn}
                    placeholder="in."
                    keyboardType="numeric"
                    placeholderTextColor={'#FFB2E6'}
                />
                <Text style={styles.dimText}>inches</Text>
            </View>

            { err3 ? 
                (<Text style={styles.err1Txt}>*Must be proper measurement. (15-25 in)*</Text>) 
                    : 
                (<></>) 
            }

            <FlatList
                data={tailShapes}
                renderItem={tailItem}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={styles.tailContainer}
            />
            
        </View>

        { err1 ? 
            (<Text style={styles.err1Txt}>*Must enter all fields.*</Text>) 
                : 
            (<></>) 
        }

        { suc   ? 
            ((<Text style={styles.sucTxt}>Board Created!</Text>) ) 
                : 
            (<></>) 
        }

        { err4 ? 
            (<Text style={styles.err1Txt}>*Name already taken*</Text>) 
                : 
            (<></>) 
        }

        { !isKeyboardOpen ? 
            (
            <TouchableOpacity style={styles.createButton} onPress={() => pressCreateBoard()}>
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            ) 
            : (<></>)
        }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C363F',
        paddingTop: 50,
        minHeight: '100%'
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },  
    createText: {
        color: '#FFB2E6',
        fontSize: 50,
        fontFamily: 'ShareTech-Regular',
        marginLeft: 20,
        marginTop: 20,
    },
    backButton: {
        marginLeft: 20,
    },
    createButton: {
        position: 'absolute',
        backgroundColor: '#FFB2E6',
        alignSelf: 'center',
        padding: 15,
        borderRadius: 30,
        marginBottom: 10,
        elevation: 5,
        bottom: 20,
        width: '90%',
    },
    buttonText: {
        fontSize: 25,
        fontFamily: 'ShareTech-Regular',
        textAlign: 'center',
    },
    input: {
        height: 50,
        margin: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FFB2E6',
        color: '#FFB2E6',
        padding: 10,
        marginTop: 50,
        fontFamily: 'ShareTech-Regular',
        fontSize: 20,
    },
    tailContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    tailItem: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flex: 1, // Ensures equal spacing between items
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dimView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FFB2E6',
        marginHorizontal: 20,
        height: 50,
        paddingLeft: 10,
        margin: 20,
    },
    dimInput: {
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: '#FFCAF2',
        color: '#FFCAF2',
        textAlign: 'center',
        fontFamily: 'ShareTech-Regular',
        fontSize: 20,
    },
    dimText: {
        color: '#FFCAF2',
        fontFamily: 'ShareTech-Regular',
        fontSize: 20,
    },
    selectedTailItem: {
        borderColor: 'limegreen',
        borderWidth: 2,
    },
    err1Txt: {
        textAlign: 'center',
        color: 'red',
    },
    sucTxt: {
        textAlign: 'center',
        color: 'green',
    },
    // tailImage: {
    //     width: 50, 
    //     height: 50
    // },
});

export default CreateBoard;