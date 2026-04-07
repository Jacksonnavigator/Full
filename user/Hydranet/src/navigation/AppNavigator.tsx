import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TermsScreen from '../screens/TermsScreen';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Report"
                component={ReportScreen}
                options={{ title: 'Report Problem' }}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'My Reports' }}
            />
        </Stack.Navigator>
    );
}

function EmergencyContactStackNavigator() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackVisible: false,
            }}
        >
            <Stack.Screen
                name="EmergencyContactScreenTab"
                component={EmergencyContactScreen}
                options={{ title: 'Emergency Contacts' }}
            />
        </Stack.Navigator>
    );
}

function TermsStackNavigator() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackVisible: false,
            }}
        >
            <Stack.Screen
                name="TermsScreenTab"
                component={TermsScreen}
                options={{ title: 'Terms & Conditions' }}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { colors, theme } = useTheme();
    const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

    const customTheme = {
        ...navigationTheme,
        colors: {
            ...navigationTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
            notification: colors.error,
        },
    };

    return (
        <NavigationContainer theme={customTheme}>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

                        if (route.name === 'Emergency') {
                            iconName = 'phone';
                        } else if (route.name === 'Terms') {
                            iconName = 'description';
                        }

                        return <MaterialIcons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.card,
                        borderTopColor: colors.border,
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStackNavigator}
                    options={{
                        tabBarLabel: 'Home',
                    }}
                />
                <Tab.Screen
                    name="Emergency"
                    component={EmergencyContactStackNavigator}
                    options={{
                        tabBarLabel: 'Emergency',
                    }}
                />
                <Tab.Screen
                    name="Terms"
                    component={TermsStackNavigator}
                    options={{
                        tabBarLabel: 'Terms',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
