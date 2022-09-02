import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Mine: undefined;
  Tab: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>;

// navigation的类型有问题，一堆类型。用这个类型代替
export type FakeNavigation = {
  navigate<Params = any>(name: keyof RootStackParamList, params?: Params): void;
  navigate<Params = any>(options: {name: keyof RootStackParamList; params: Params}): void;
};

export type FakeRoute<Params = any> = {
  params?: Params;
};
