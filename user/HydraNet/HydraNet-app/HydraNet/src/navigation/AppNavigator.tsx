import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ReportScreen from '../screens/ReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TermsScreen from '../screens/TermsScreen';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ReportStackNavigator() {
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
                name="ReportScreen"
                component={ReportScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Report History' }}
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
                headerLeft: null,
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
                headerLeft: null,
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
    
    // Use React Navigation's built-in themes and customize them
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
                initialRouteName="Report"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof MaterialIcons.glyphMap = 'phone';
                        if (route.name === 'Report') {
                            iconName = 'water-damage';
                        } else if (route.name === 'Emergency') {
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
                    name="Report"
                    component={ReportStackNavigator}
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