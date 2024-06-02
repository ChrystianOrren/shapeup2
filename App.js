// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { enableScreens } from 'react-native-screens'; // Import from react-native-screens
import { useFonts } from 'expo-font';
import Loading from './Loading';

// Enable screens optimization
enableScreens();

const App = () => {
  // Load the font
  const [fontsLoaded] = useFonts({
    'Super Dream': require('./assets/fonts/Super Dream.ttf'),
    'ShareTech-Regular': require('./assets/fonts/ShareTech-Regular.ttf'),
  });

  if (!fontsLoaded) {
    // Font is still loading, return a loading indicator or null
    return <Loading/>;
  }

  return (
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
};

export default App;