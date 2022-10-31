import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IDBody} from '../fst/models';
import {OrderStatus} from './order';

export type RootStackParamList = {
  TestPage: undefined;
  Login: {to: keyof RootStackParamList; params: any};
  Tab: undefined;
  Home: undefined;
  Discover: undefined;
  // Notify: undefined;
  OrderList: {state?: OrderStatus};
  Mine: undefined;
  WorkDetail: {
    id: string;
    videoUrl: string;
  };
  WorkDetailList: {index: number};
  SPUDetail: IDBody;
  Order: IDBody;
  OrderDetail: IDBody;
  Wallet: undefined;
  WalletSummary: undefined;
  WalletSummaryAgent: undefined;
  Withdrawal: undefined;
  MyCode: {type: 'friend' | 'share'};
  ShootVideo: undefined;
  Publish: undefined;
  PublishVideo: undefined;
  PublishPhoto: undefined;
  SelectSPU: undefined;
  PaySuccess: undefined;
  WaitPay: undefined;
  Browser: {url: string};
  User: {id: number};
  Refund: {id: string};
  OrderComment: IDBody;
  CouponList: undefined;
  Certification: undefined;
  WalletSettings: undefined;
  BankCards: undefined;
  AddBankCard: undefined;
  OrderBooking: IDBody;
  WithdrawalRecords: undefined;
  Profile: undefined;
  Settings: undefined;
  MyWorkDetail: undefined;
  UserWorkDetail: {id: number};
  MyShowcase: undefined;
  OtherShowcase: {id: number};
  SearchSPU: undefined;
  Scanner: undefined;
  ScanResult: {content: string};
  MyProfile: undefined; // 个人资料修改
  SingleWorkDetail: {id: string};
};

export type ValidRoute = keyof RootStackParamList;

export type Props = NativeStackScreenProps<RootStackParamList>;

// navigation的类型有问题，一堆类型。用这个类型代替
export type FakeNavigation = {
  navigate<Params = any>(name: keyof RootStackParamList, params?: Params): void;
  navigate<Params = any>(options: {name?: keyof RootStackParamList; params?: Params; key?: string}): void;
  canGoBack(): boolean;
  goBack(): void;
  isFocused(): void;
  replace<Params = any>(name: keyof RootStackParamList, params?: Params): void;
  replace<Params = any>(options: {name?: keyof RootStackParamList; params?: Params; key?: string}): void;
  popToTop(): void;
  getState(): any;
};

export type FakeRoute<Params = any> = {
  params?: Params;
};
