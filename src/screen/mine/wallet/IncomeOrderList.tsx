import React, {useCallback, useState} from 'react';
import {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {useCommonDispatcher, useWalletSummary} from '../../../helper/hooks';
import {FakeNavigation, LoadListState, UserIncomeF, UserIncomeState} from '../../../models';
import * as api from '../../../apis';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {BoolEnum} from '../../../fst/models';
import Icon from '../../../component/Icon';
import {isReachBottom} from '../../../helper/system';
import Loading from '../../../component/Loading';
import Empty from '../../../component/Empty';
import {useNavigation} from '@react-navigation/native';

const IncomeOrderList: React.FC = () => {
  const [incomeOrderData, setIncomeOrderData] = useState<LoadListState<UserIncomeF>>({list: [], status: 'none', index: 0});
  const [initLoading, setInitLoading] = useState(true); // 是否显示初始化加载

  const [walletSummary] = useWalletSummary();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  const loadIncomeOrderData = useCallback(
    async (replace = false) => {
      if (incomeOrderData.status !== 'noMore' || replace) {
        const index = replace ? 1 : incomeOrderData.index + 1;
        const pageSize = 10;
        setInitLoading(false);
        setIncomeOrderData({...incomeOrderData, status: 'loading'});
        try {
          const res = await api.user.getIncomeList({
            pageIndex: index,
            pageSize,
          });
          const newUsers: LoadListState<UserIncomeF> = {
            list: replace ? res : [...incomeOrderData.list, ...res],
            status: res.length < pageSize ? 'noMore' : 'none',
            index,
          };
          setIncomeOrderData(newUsers);
        } catch (error) {
          commonDispatcher.error(error);
        }
      }
    },
    [commonDispatcher, incomeOrderData],
  );

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e)) {
      loadIncomeOrderData();
    }
  }

  function handleRefresh() {
    loadIncomeOrderData(true);
  }

  useEffect(() => {
    if (!initLoading) {
      return;
    }
    loadIncomeOrderData(true);
  }, [initLoading, loadIncomeOrderData]);

  function renderEmpty() {
    if (incomeOrderData.status === 'loading') {
      return <Loading style={{marginTop: 120}} />;
    }
    return <Empty style={{marginTop: 120}} text="暂无收益明细" />;
  }

  function renderIncomeOrderItem({item}: {item: UserIncomeF}) {
    const {status, boughtItSelf, fromTeam, moneyList, orderSmallIdStr} = item;
    const refund = status === UserIncomeState.REFUND;
    const cashColor = refund ? '#333' : globalStyleVariables.COLOR_CASH;
    const commissionText = refund ? '订单退款，佣金已退回' : boughtItSelf === BoolEnum.TRUE ? '获得佣金' : '为你带来一份佣金';
    const commissionList = moneyList || [];
    const showIcon = !refund;
    let commentIcon = null as React.ReactElement;
    if (showIcon) {
      if (status === UserIncomeState.COMMENT_CHECKED) {
        commentIcon = (
          <View style={[styles.statusIcon, styles.normalIcon]}>
            <Icon name="wode_qianbao_mingxi_sign_nor" color="#278AF1" width={10} height={7} />
          </View>
        );
      } else if (status === UserIncomeState.COMMENT_EXPIRED) {
        commentIcon = (
          <View style={[styles.statusIcon, styles.expiredIcon]}>
            <Icon name="wode_qianbao_mingxi_sign_notice" color="#999" width={3} height={10} />
          </View>
        );
      } else {
        commentIcon = (
          <View style={[styles.statusIcon, styles.warningIcon]}>
            <Icon name="wode_qianbao_mingxi_sign_notice" color="#FF7715" width={3} height={10} />
          </View>
        );
      }
    }
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('IncomeOrderDetail', {orderSmallId: orderSmallIdStr})}>
        <View style={[styles.orderItem]}>
          <View style={[globalStyles.containerLR]}>
            <View style={[globalStyles.containerRow]}>
              <Image source={{uri: item.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 20, height: 20, borderRadius: 20}} />
              <Text style={{fontSize: 15, color: globalStyleVariables.COLOR_LINK, marginHorizontal: 5}}>{item.nickName}</Text>
              {boughtItSelf === BoolEnum.TRUE && (
                <View style={[globalStyles.containerCenter, styles.mineTag]}>
                  <Text style={[styles.tagText, {color: '#fff'}]}>自己</Text>
                </View>
              )}
            </View>
            <Text style={[globalStyles.fontTertiary]}>{item.createdTime}</Text>
          </View>
          <View style={[globalStyles.containerLR, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
            <View style={[globalStyles.containerRow]}>
              <Text style={[{fontSize: 15, fontWeight: '600', color: cashColor}]}>{commissionText}</Text>
              {fromTeam === BoolEnum.TRUE && (
                <View style={[globalStyles.containerCenter, styles.teamTag, {marginLeft: 5}]}>
                  <Text style={[styles.tagText, {color: globalStyleVariables.COLOR_PRIMARY}]}>团队</Text>
                </View>
              )}
            </View>
            <Text style={{color: cashColor}}>
              {!refund && <Text style={{fontSize: 12}}>+</Text>}
              <Text style={{fontSize: 20}}>{item.moneyYuan}</Text>
            </Text>
          </View>
          <View style={[styles.commissionDetail, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
            {commissionList.map((commission, index) => {
              const {status} = commission;
              let icon = null as React.ReactElement;
              if (showIcon) {
                if (status === UserIncomeState.CHECKED) {
                  icon = (
                    <View style={[styles.statusIcon, styles.normalIcon]}>
                      <Icon name="wode_qianbao_mingxi_sign_nor" color="#278AF1" width={10} height={7} />
                    </View>
                  );
                } else {
                  icon = (
                    <View style={[styles.statusIcon, styles.warningIcon]}>
                      <Icon name="wode_qianbao_mingxi_sign_notice" color="#FF7715" width={3} height={10} />
                    </View>
                  );
                }
              }
              return (
                <View key={index} style={[globalStyles.containerLR, {height: 28}]}>
                  <View style={[globalStyles.containerRow]}>
                    <Text style={[styles.commissionItemText, {marginRight: 5}]}>{commission.title}</Text>
                    {icon}
                  </View>
                  <Text style={[styles.commissionItemText]}>{commission.moneyYuan}</Text>
                </View>
              );
            })}
            {item.commentInfo && (
              <>
                {!!commissionList?.length && <View style={globalStyles.lineHorizontal} />}
                <View style={[globalStyles.containerLR, {height: 28}]}>
                  <View style={[globalStyles.containerRow]}>
                    <Text style={[styles.commissionItemText, {marginRight: 5}]}>{item.commentInfo?.title}</Text>
                    {commentIcon}
                  </View>
                  <Text style={[styles.commissionItemText]}>{item.commentInfo?.moneyYuan}</Text>
                </View>
              </>
            )}
          </View>
          {item.spuName && (
            <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
              <Text numberOfLines={1}>
                <Text style={[globalStyles.fontTertiary]}>通过 </Text>
                <Text style={[{fontSize: 12, color: globalStyleVariables.TEXT_COLOR_PRIMARY, fontWeight: '600'}]}>{item.spuName}</Text>
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="累计收益明细" />
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <FlatList
          data={incomeOrderData.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
          ItemSeparatorComponent={() => <View style={globalStyles.lineHorizontal} />}
          contentContainerStyle={{paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}}
          renderItem={renderIncomeOrderItem}
          ListEmptyComponent={renderEmpty}
          keyExtractor={item => item.orderSmallIdStr}
          onMomentumScrollEnd={handleScrollEnd}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={{height: 50}}>
                <View style={[globalStyles.containerRow]}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>全部</Text>
                  <Text style={{marginLeft: 20}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 30}]}>{walletSummary.totalMoneyYuan}</Text>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>芽</Text>
                  </Text>
                </View>
              </View>
              <View style={globalStyles.lineHorizontal} />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default IncomeOrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderItem: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  mineTag: {
    borderRadius: 3,
    padding: 2,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  teamTag: {
    borderRadius: 3,
    padding: 2,
    backgroundColor: '#ff59341A',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commissionDetail: {
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  commissionItemText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  statusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 18,
  },
  normalIcon: {
    backgroundColor: '#278af11a',
  },
  warningIcon: {
    backgroundColor: '#ff77151a',
  },
  expiredIcon: {
    backgroundColor: '#9999991a',
  },
});
