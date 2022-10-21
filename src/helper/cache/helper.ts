import AsyncStorage from '@react-native-async-storage/async-storage';
import {CacheKeys} from '../../models';

export async function getItem(key: CacheKeys | string): Promise<string> {
  try {
    const res = await AsyncStorage.getItem(key);
    return res as string;
  } catch (error) {
    return '';
  }
}

export async function setItem(key: CacheKeys | string, value: string): Promise<void> {
  value = String(value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {}
}
