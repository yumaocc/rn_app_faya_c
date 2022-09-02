import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../models';

export const Stack = createNativeStackNavigator<RootStackParamList>();
export const commonScreenOptions = {
  headerShown: false,
};
