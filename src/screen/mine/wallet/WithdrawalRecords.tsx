import React, {useCallback, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator} from 'react-native';
import {NavigationBar} from '../../../component';
import {LoadingState, WithdrawalRecord} from '../../../models';
import * as api from '../../../apis';
import {SearchParam} from '../../../fst/models';
import {isReachBottom} from '../../../helper/system';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {dictLoadingState, dictWithdrawState} from '../../../helper/dictionary';
import MyStatusBar from '../../../component/MyStatusBar';

const WithdrawalRecords: React.FC = () => {
  const [list, setList] = React.useState<WithdrawalRecord[]>([]);
  const [status, setStatus] = React.useState<LoadingState>('none');
  const [pageIndex, setPageIndex] = React.useState(0);
  const showNoMore = useMemo(() => status === 'noMore' && list.length > 0, [status, list]);
  const showEmpty = useMemo(() => status === 'noMore' && list.length === 0, [status, list]);
  const showLoading = useMemo(() => status === 'loading' && list.length !== 0, [status, list]);

  const loadRecords = useCallback(async (search: SearchParam, replace = false, currentIndex = 0, currentStatus = 'none') => {
    if (currentStatus !== 'noMore' || replace) {
      setStatus('loading');
      setList([]);
      const pageSize = 20;
      const index = replace ? 1 : currentIndex + 1;
      const res = await api.user.getWithdrawRecord({...search, pageIndex: index, pageSize});
      setList(res);
      setPageIndex(index);
      setStatus(res.length < pageSize ? 'noMore' : 'none');
    }
  }, []);

  useEffect(() => {
    loadRecords({}, true);
  }, [loadRecords]);

  function handleRefresh() {
    loadRecords({}, true);
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      loadRecords({}, false, pageIndex, status);
    }
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="提现记录" />
      <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />} onMomentumScrollEnd={handleScrollEnd}>
        <View>
          {list.map((record, index) => {
            const hasLine = index !== 0;
            let statusColor = globalStyleVariables.COLOR_WARNING_YELLOW;
            if (record.status === 3) {
              statusColor = globalStyleVariables.COLOR_CASH;
            } else if ([2, 4].includes(record.status)) {
              statusColor = globalStyleVariables.COLOR_WARNING_RED;
            }
            return (
              <View key={index} style={[styles.item, hasLine && styles.itemBorder]}>
                <View style={globalStyles.containerLR}>
                  <Text>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>提现</Text>
                    <Text style={[globalStyles.fontTertiary, {color: statusColor}]}> {dictWithdrawState(record.status)}</Text>
                  </Text>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{record.moneyYuan}</Text>
                </View>
                <View style={[globalStyles.containerLR, {marginTop: 10}]}>
                  <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>{record.createdTime}</Text>
                  <Text style={[globalStyles.fontTertiary, {fontSize: 15}]}>当时余额：{record.canWithdrawalMoneyYuan}</Text>
                </View>
              </View>
            );
          })}
        </View>
        {showNoMore && (
          <View style={[globalStyles.containerCenter, {paddingVertical: 20}]}>
            <Text>{dictLoadingState('noMore')}</Text>
          </View>
        )}
        {showLoading && (
          <View style={[globalStyles.containerCenter, {paddingVertical: 20}]}>
            <ActivityIndicator size="small" color={globalStyleVariables.COLOR_PRIMARY} />
            <Text style={{marginTop: 10}}>正在加载...</Text>
          </View>
        )}
        {showEmpty && (
          <View style={[globalStyles.containerCenter, {paddingTop: 100, paddingBottom: 20}]}>
            <Text>暂无提现记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WithdrawalRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: globalStyleVariables.BORDER_COLOR,
  },
});
