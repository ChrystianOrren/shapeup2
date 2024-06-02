import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from 'react-native';
import Dashboard from './Dashboard';
import Design from './Design';
import Loading from './Loading';
import CreateBoard from './CreateBoard';
import Settings from './Settings';

const Stack = createStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementTreshold: 0.01,
        restSpeedThreshold: 0.01,
    }
}

const closeConfig = { 
    animation: 'timing',
    config: {
        duration: 200,
        easing: Easing.linear,
    }
}

const AppNavigator = () => {
  return (
    <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
            gestureEnabled: false,
            gestureDirection: 'horizontal',
            headerShown: false,
            transitionSpec: {
                open: config,
                close: closeConfig,
            },
        }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/>
      <Stack.Screen name="Design" component={Design} 
        options={{ 
            gestureEnabled: false,
            gestureDirection: 'vertical',
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
        }}
      />
      <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateBoard" component={CreateBoard} 
        options={{ 
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
      />
      <Stack.Screen name="Settings" component={Settings}
        options={{ 
          gestureEnabled: false,
          gestureDirection: 'vertical',
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
