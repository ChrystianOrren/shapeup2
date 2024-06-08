import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Linking, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {

    {/* Navigation */}
    const navigation = useNavigation();

    {/* useStates */}
    const [ support, setSupport] = useState(false);
    const [ help, setHelp ] = useState(false);
    const [ about, setAbout ] = useState(false);
    const [ helpMsg, setHelpMsg] = useState('');
    const [ donModal, setDonModal] = useState(false);

    const goBack = () => {
        navigation.goBack();
    }

    const supportMe = () => {
        setSupport(!support);
        setDonModal(false);
    }

    const helpMe = () => {
        setHelp(!help);
        setHelpMsg('');
    }

    const aboutMe = () => {
        setAbout(!about);
    }

    const sendHelp = () => {
        console.log(helpMsg);
        if (helpMsg !== '') {
            const subject = "ShapeUp Help/Feedback";
            const body = encodeURIComponent(helpMsg);
            const mailtoUrl = `mailto:orren.chris@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            Linking.openURL(mailtoUrl).catch(err => console.error('Error opening email client', err));
        }
    }

    const pressDonate = () => {
        setDonModal(!donModal);
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                <FontAwesome5 name="arrow-left" size={30} color="#FFB2E6" />
            </TouchableOpacity>

            <Text style={styles.createText}>Settings...</Text>

            <View style={styles.body}>
                <TouchableOpacity onPress={() => helpMe()} style={styles.touchable}>
                    <Text style={styles.touchText}>Help / Feedback</Text>
                    { !help ? 
                    <FontAwesome5 name="chevron-right" size={30} color="#FFB2E6" /> :
                    <FontAwesome5 name="chevron-down" size={30} color="#FFB2E6" />
                    }
                </TouchableOpacity>
                { help ?
                    <View style={styles.dropDown}>
                        <Text style={styles.dropDownText}>If you need help with anything, whether it's a bug or missing feature. Send me a message and I'll get back to you.</Text>
                        <TextInput style={styles.txtIn} placeholderTextColor={'#FFB2E6'} placeholder="Message..." onChangeText={setHelpMsg} value={helpMsg} multiline={true} numberOfLines={3}/>
                        <TouchableOpacity style={styles.helpSend} onPress={() => sendHelp()}>
                            <Text style={{fontFamily: 'ShareTech-Regular', fontSize: 25,}}>Send</Text>
                        </TouchableOpacity>
                    </View>
                : <></>}
                <TouchableOpacity onPress={() => aboutMe()} style={styles.touchable}>
                    <Text style={styles.touchText}>About Me</Text>
                    { !about ? 
                    <FontAwesome5 name="chevron-right" size={30} color="#FFB2E6" /> :
                    <FontAwesome5 name="chevron-down" size={30} color="#FFB2E6" />
                    }
                </TouchableOpacity>
                { about ?
                    <View style={styles.dropDown}>
                        <Text style={styles.dropDownText}>
                            Hello! My name is Chrystian and my love of surfing pushed me toward the art of shaping and glassing.
                            After making my first baord I realized the Play Store didn't have an app to design outlines.
                            So I thought it would be a fun project to make one. So here you go shapers.
                        </Text>
                        <Image source={require('./assets/images/aboutPic.jpg')} style={styles.aboutPic} />
                    </View>
                : <></>}
                <TouchableOpacity onPress={() => supportMe()} style={styles.touchable}>
                    <Text style={styles.touchText}>Support Me</Text>
                    { !support ? 
                    <FontAwesome5 name="chevron-right" size={30} color="#FFB2E6" /> :
                    <FontAwesome5 name="chevron-down" size={30} color="#FFB2E6" />
                    }
                </TouchableOpacity>
                { support ?
                    <View style={styles.dropDown}>
                        <Text style={styles.dropDownText}>
                            If you've enjoyed using this app and found it helpful in your shaping journey, consider supporting me with a donation. 
                            Your contributions will help cover the costs of maintaining and improving the app, and enable me to continue developing new features and updates.
                            Thank you for your support and for being part of this amazing community!
                        </Text>
                        { !donModal ? 
                            <TouchableOpacity style={styles.helpSend} onPress={() => pressDonate()}>
                                <Text style={{fontFamily: 'ShareTech-Regular', fontSize: 20,}}>Donate</Text>
                            </TouchableOpacity>
                        : <></>}
                        { donModal ? 
                            <View style={styles.moneyView}>
                                <View style={styles.moneyTab}>
                                    <Image source={require('./assets/images/cashappicon.png')} style={styles.moneyIcon}/>
                                    <Text style={styles.moneyTxt}>$ChrystianOrren</Text>
                                </View>
                                <View style={styles.moneyTab}>
                                    <Image source={require('./assets/images/paypalicon.png')} style={styles.moneyIcon}/>
                                    <Text style={styles.moneyTxt}>@ChrystianOrren</Text>
                                </View>
                                <View style={styles.moneyTab}>
                                    <Image source={require('./assets/images/venmoicon.png')} style={styles.moneyIcon}/>
                                    <Text style={styles.moneyTxt}>@Chrystian-Orren</Text>
                                </View>
                            </View>
                         : <></>}
                    </View>
                : <></>}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C363F',
        paddingTop: 50,
        minHeight: '100%'
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
    body: {
        margin: 20,
    },
    touchText: {
        color: '#FFB2E6',
        fontSize: 20,
        fontFamily: 'ShareTech-Regular',
    },
    touchable: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: '#404A53',
        elevation: 10,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center', // Center vertically
        justifyContent: 'space-between', // Space between text and icon
    },
    dropDown: {
        backgroundColor: '#404A53',
        elevation: 10,
        borderRadius: 3,
        padding: 10,
    },
    dropDownText: {
        color: '#FFB2E6', 
        fontFamily: 'ShareTech-Regular', 
        fontSize: 18,
    },
    aboutPic: {
        width: 250,
        height: 200,
        margin: 20,
        alignSelf: 'center',
        elevation: 5,
    },
    txtIn: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FFB2E6',
        color: '#FFB2E6',
        padding: 5,
        fontFamily: 'ShareTech-Regular',
        margin: 10,
        fontSize: 20,
        textAlignVertical: 'top',
    },
    helpSend: {
        margin: 10,
        backgroundColor: '#FFB2E6',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        width: '30%',
        alignSelf: 'center'
    },
    donIn: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FFB2E6',
        color: '#FFB2E6',
        padding: 5,
        fontFamily: 'ShareTech-Regular',
        marginVertical: 10,
        fontSize: 20,
        width: '50%'
    },
    moneyView: {
        marginTop: 20,
    },
    moneyIcon: {
        height: 50,
        width: 50,
    },
    moneyTab: {
        flexDirection: 'row', 
        alignItems: 'center',
        margin: 10,
        textAlign: 'center',
    },
    moneyTxt: {
        paddingLeft: 10,
        color: '#FFB2E6',
        fontSize: 20,
        fontFamily: 'ShareTech-Regular',
    }
});

export default Settings;