import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IDBody} from '../fst/models';
import {OrderStatus} from './order';

export type RootStackParamList = {
  Login: {to: keyof RootStackParamList; params: any};
  Tab: undefined;
  Home: undefined;
  Discover: undefined;
  Notify: undefined;
  Mine: undefined;
  WorkDetail: {
    id: string;
    videoUrl: string;
  };
  SPUDetail: IDBody;
  Order: IDBody;
  OrderList: {state?: OrderStatus};
  OrderDetail: IDBody;
  Wallet: undefined;
  WalletSummary: undefined;
  WalletSummaryAgent: undefined;
  Withdrawal: undefined;
  MyCode: {type: 'friend' | 'share'};
  ShootVideo: undefined;
  Publish: undefined;
  SelectSPU: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>;

// navigation的类型有问题，一堆类型。用这个类型代替
export type FakeNavigation = {
  navigate<Params = any>(name: keyof RootStackParamList, params?: Params): void;
  navigate<Params = any>(options: {name: keyof RootStackParamList; params: Params}): void;
  canGoBack(): boolean;
  goBack(): void;
};

export type FakeRoute<Params = any> = {
  params?: Params;
};
