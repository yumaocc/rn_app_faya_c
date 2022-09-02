import AsyncStorage from '@react-native-async-storage/async-storage';
import {CacheKeys} from '../../models';

export async function getItem(key: CacheKeys): Promise<string> {
  try {
    const res = await AsyncStorage.getItem(key);
    return res as string;
  } catch (error) {
    return '';
  }
}

export async function setItem(key: CacheKeys, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {}
}
