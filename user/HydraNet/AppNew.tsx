/**
 * HydraNet Mobile - Complete App Example
 * Demonstrates full integration of new architecture
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// Import new architecture components
import { useAuth } from '@/hooks';
import { LoginScreen } from '@/screens/LoginScreenNew';
import { UtilitiesScreen } from '@/screens/UtilitiesScreenNew';
import { TasksScreen } from '@/screens/TasksScreenNew';
import { IntegrationTestScreen } from '@/screens/IntegrationTestScreen';
import { Button } from '@/components/shared';

const Stack = createStackNavigator();

export function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading HydraNet...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                headerRight: () => (
                  <Button
                    label="Logout"
                    onPress={logout}
                    variant="secondary"
                    size="small"
                    style={{ marginRight: 10 }}
                  />
                ),
              }}
            />
            <Stack.Screen name="Utilities" component={UtilitiesScreen} />
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen name="IntegrationTest" component={IntegrationTestScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DashboardScreen({ navigation }: any) {
  const { currentUser } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to HydraNet</Text>
        <Text style={styles.welcomeSubtitle}>
          Hello, {currentUser?.name || 'User'}!
        </Text>
        <Text style={styles.userRole}>
          Role: {currentUser?.user_type || currentUser?.role || 'Unknown'}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <Button
          label="View Utilities"
          onPress={() => navigation.navigate('Utilities')}
          style={styles.menuButton}
        />

        <Button
          label="View Tasks"
          onPress={() => navigation.navigate('Tasks')}
          variant="secondary"
          style={styles.menuButton}
        />

        <Button
          label="Integration Test"
          onPress={() => navigation.navigate('IntegrationTest')}
          variant="outline"
          style={styles.menuButton}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Demo Credentials:</Text>
        <Text style={styles.infoText}>• Admin: admin@hydranet.com / admin123</Text>
        <Text style={styles.infoText}>• Manager: testmgr_u0@test.com / test123</Text>
        <Text style={styles.infoText}>• Manager: testmgr_u1@test.com / test123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuButton: {
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});

export default App;
