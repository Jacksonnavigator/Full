/**
 * HydraNet Offline Queue
 * Queues submissions/actions when offline and retries when connection restored
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

export interface QueuedAction {
  id: string;
  type: 'SUBMIT_REPAIR' | 'UPDATE_STATUS' | 'APPROVE_SUBMISSION' | 'REJECT_SUBMISSION';
  payload: Record<string, any>;
  timestamp: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
}

const QUEUE_STORAGE_KEY = 'hydranet_offline_queue';
const MAX_RETRY_ATTEMPTS = 5;

/**
 * Add an action to the offline queue
 */
export async function queueAction(
  type: QueuedAction['type'],
  payload: Record<string, any>
): Promise<void> {
  try {
    const queue = await getQueue();

    const action: QueuedAction = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      attempts: 0,
      maxAttempts: MAX_RETRY_ATTEMPTS,
    };

    queue.push(action);
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));

    console.log(`Action queued: ${type}`);
  } catch (error) {
    console.error('Error queuing action:', error);
    throw error;
  }
}

/**
 * Get all queued actions
 */
export async function getQueue(): Promise<QueuedAction[]> {
  try {
    const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting queue:', error);
    return [];
  }
}

/**
 * Process all queued actions
 * Called when connectivity is restored
 */
export async function processQueue(
  actionHandler: (action: QueuedAction) => Promise<void>
): Promise<void> {
  try {
    const isOnline = await isNetworkConnected();
    if (!isOnline) {
      console.log('Still offline; will not process queue');
      return;
    }

    const queue = await getQueue();
    const remaining: QueuedAction[] = [];

    for (const action of queue) {
      try {
        // Call the handler with current action
        await actionHandler(action);
        console.log(`Processed queued action: ${action.id}`);
      } catch (error) {
        // Increase attempt count and re-queue if under max
        action.attempts += 1;
        action.lastError = (error instanceof Error) ? error.message : String(error);

        if (action.attempts < action.maxAttempts) {
          remaining.push(action);
          console.warn(
            `Action ${action.id} failed (attempt ${action.attempts}/${action.maxAttempts}), will retry`
          );
        } else {
          console.error(
            `Action ${action.id} exceeded max retry attempts. Removing from queue.`
          );
          // Optionally log failed action for admin review
          await logFailedAction(action);
        }
      }
    }

    // Update queue with remaining actions
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remaining));
  } catch (error) {
    console.error('Error processing queue:', error);
  }
}

/**
 * Clear a specific action from queue
 */
export async function removeQueuedAction(actionId: string): Promise<void> {
  try {
    const queue = await getQueue();
    const filtered = queue.filter((a) => a.id !== actionId);
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing queued action:', error);
  }
}

/**
 * Clear all queued actions
 */
export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    console.log('Offline queue cleared');
  } catch (error) {
    console.error('Error clearing queue:', error);
  }
}

/**
 * Check network connectivity
 */
export async function isNetworkConnected(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected && (state.isInternetReachable ?? true);
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Log failed action for admin review
 */
async function logFailedAction(action: QueuedAction): Promise<void> {
  try {
    const failedKey = 'hydranet_failed_actions';
    const failed = await AsyncStorage.getItem(failedKey);
    const failedList = failed ? JSON.parse(failed) : [];
    failedList.push({
      ...action,
      failedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(failedKey, JSON.stringify(failedList));
  } catch (error) {
    console.error('Error logging failed action:', error);
  }
}

/**
 * Setup network listener for auto-retry
 */
export function setupNetworkListener(
  onOnline: () => void,
  onOffline: () => void
): (() => void) | null {
  try {
    const subscription = Network.addEventListener('networkStateChange', (state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('Network connected; processing offline queue');
        onOnline();
      } else {
        console.log('Network disconnected; queueing actions');
        onOffline();
      }
    });

    return () => subscription.remove();
  } catch (error) {
    console.error('Error setting up network listener:', error);
    return null;
  }
}
