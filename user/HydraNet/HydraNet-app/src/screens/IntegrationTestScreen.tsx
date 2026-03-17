/**
 * Integration Test - Full App Flow
 * Tests the complete integration of all new architecture components
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

// Import all new architecture components
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@/hooks/useQuery';
import { useApi } from '@/hooks/useApi';
import { AuthService } from '@/services/api/auth';
import { TaskService } from '@/services/api/tasks';
import { UtilityService } from '@/services/api/utilities';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { CONFIG } from '@/lib/config';
import { AuthManager } from '@/lib/auth';
import { formatDate, getStatusColor } from '@/lib/utils';

export function IntegrationTestScreen() {
  const { currentUser, isAuthenticated, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  // Test useQuery hook with utilities
  const {
    data: utilities,
    isLoading: utilitiesLoading,
    error: utilitiesError,
    refetch: refetchUtilities
  } = useQuery(
    ['utilities'],
    () => UtilityService.getUtilities(),
    { enabled: isAuthenticated }
  );

  // Test useApi hook with tasks
  const {
    data: tasks,
    execute: fetchTasks,
    isLoading: tasksLoading,
    error: tasksError
  } = useApi(() => TaskService.getTasks({ limit: 5 }));

  // Test authentication flow
  const testAuthFlow = async () => {
    try {
      setTestResults(prev => [...prev, '🔄 Testing authentication flow...']);

      // Test login
      await login({
        email: 'admin@hydranet.com',
        password: 'admin123'
      });

      setTestResults(prev => [...prev, '✅ Login successful']);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Login failed: ${error.message}`]);
    }
  };

  // Test API client directly
  const testApiClient = async () => {
    try {
      setTestResults(prev => [...prev, '🔄 Testing API client...']);

      const response = await AuthService.getProfile();
      setTestResults(prev => [...prev, `✅ API client working - User: ${response.name}`]);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ API client failed: ${error.message}`]);
    }
  };

  // Test data fetching
  const testDataFetching = async () => {
    try {
      setTestResults(prev => [...prev, '🔄 Testing data fetching...']);

      await fetchTasks();
      setTestResults(prev => [...prev, '✅ Data fetching initiated']);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Data fetching failed: ${error.message}`]);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults(['🚀 Starting integration tests...']);

    if (!isAuthenticated) {
      await testAuthFlow();
      // Wait a bit for auth to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (isAuthenticated) {
      await testApiClient();
      await testDataFetching();
    }

    setTestResults(prev => [...prev, '✅ All tests completed']);
  };

  return (
    <ScrollView style={styles.container}>
      <Card variant="elevated" style={styles.headerCard}>
        <Text style={styles.title}>Integration Test Suite</Text>
        <Text style={styles.subtitle}>
          Testing all new architecture components
        </Text>

        <View style={styles.statusContainer}>
          <Badge
            label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            variant={isAuthenticated ? 'success' : 'error'}
          />
          {currentUser && (
            <Text style={styles.userInfo}>
              User: {currentUser.name} ({currentUser.user_type})
            </Text>
          )}
        </View>
      </Card>

      <Card style={styles.testControls}>
        <Text style={styles.sectionTitle}>Test Controls</Text>

        <Button
          label="Run All Tests"
          onPress={runAllTests}
          style={styles.testButton}
        />

        <View style={styles.buttonRow}>
          <Button
            label="Test Auth"
            onPress={testAuthFlow}
            variant="secondary"
            size="small"
            style={styles.smallButton}
          />
          <Button
            label="Test API"
            onPress={testApiClient}
            variant="secondary"
            size="small"
            style={styles.smallButton}
          />
          <Button
            label="Test Data"
            onPress={testDataFetching}
            variant="secondary"
            size="small"
            style={styles.smallButton}
          />
        </View>

        {isAuthenticated && (
          <Button
            label="Logout"
            onPress={logout}
            variant="outline"
            size="small"
            style={styles.logoutButton}
          />
        )}
      </Card>

      <Card style={styles.resultsCard}>
        <Text style={styles.sectionTitle}>Test Results</Text>

        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No tests run yet</Text>
        ) : (
          <ScrollView style={styles.resultsScroll}>
            {testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))}
          </ScrollView>
        )}
      </Card>

      <Card style={styles.dataCard}>
        <Text style={styles.sectionTitle}>Live Data Preview</Text>

        <View style={styles.dataSection}>
          <Text style={styles.dataTitle}>Utilities (useQuery):</Text>
          {utilitiesLoading ? (
            <Text style={styles.loadingText}>Loading utilities...</Text>
          ) : utilitiesError ? (
            <Text style={styles.errorText}>Error: {utilitiesError.message}</Text>
          ) : utilities ? (
            <Text style={styles.dataText}>
              Found {utilities.length} utilities
            </Text>
          ) : (
            <Text style={styles.noDataText}>No utilities data</Text>
          )}
        </View>

        <View style={styles.dataSection}>
          <Text style={styles.dataTitle}>Tasks (useApi):</Text>
          {tasksLoading ? (
            <Text style={styles.loadingText}>Loading tasks...</Text>
          ) : tasksError ? (
            <Text style={styles.errorText}>Error: {tasksError.message}</Text>
          ) : tasks ? (
            <Text style={styles.dataText}>
              Found {tasks.length} tasks
            </Text>
          ) : (
            <Text style={styles.noDataText}>No tasks data</Text>
          )}
        </View>
      </Card>

      <Card style={styles.configCard}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        <Text style={styles.configText}>
          API URL: {CONFIG.API_BASE_URL}
        </Text>
        <Text style={styles.configText}>
          Auth Manager: {AuthManager.isAuthenticated() ? 'Active' : 'Inactive'}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    fontSize: 14,
    color: '#4b5563',
  },
  testControls: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  testButton: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
  },
  resultsCard: {
    marginBottom: 16,
    maxHeight: 200,
  },
  resultsScroll: {
    maxHeight: 150,
  },
  resultText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  noResults: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  dataCard: {
    marginBottom: 16,
  },
  dataSection: {
    marginBottom: 16,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#059669',
  },
  loadingText: {
    fontSize: 14,
    color: '#d97706',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  noDataText: {
    fontSize: 14,
    color: '#6b7280',
  },
  configCard: {
    marginBottom: 16,
  },
  configText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default IntegrationTestScreen;