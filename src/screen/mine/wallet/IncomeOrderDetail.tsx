import React from 'react';
import {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {NavigationBar} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import {FakeNavigation, UserIncomeF, UserIncomeState} from '../../../models';
import * as api from '../../../apis';
import {SafeAreaView} from 'react-native-safe-area-context';
import Loading from '../../../component/Loading';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {BoolEnum} from '../../../fst/models';
import Icon from '../../../component/Icon';
import {useNavigation} from '@react-navigation/native';
import MyImage from '../../../component/MyImage';

const IncomeOrderDetail: React.FC = () => {
  const {orderSmallId} = useParams<{orderSmallId: string}>();
  const [incomeOrder, setIncomeOrder] = React.useState<UserIncomeF>(null);
  const [commonDispatcher] = useCommonDispatcher();

  const refund = incomeOrder?.status === UserIncomeState.REFUND;
  const showIcon = !refund;
  const cashColor = refund ? '#333' : globalStyleVariables.COLOR_CASH;
  const commissionText = refund ? '订单退款，佣金已退回' : incomeOrder?.boughtItSelf === BoolEnum.TRUE ? '获得佣金' : '为你带来一份佣金';
  const moneyList = incomeOrder?.moneyList || [];
  const commentStatus = incomeOrder?.commentInfo?.status;
  let commentIcon = null as React.ReactElement;
  if (showIcon) {
    if (commentStatus === UserIncomeState.COMMENT_CHECKED) {
      commentIcon = (
        <View style={[styles.statusWrapper, {backgroundColor: '#278af11a'}]}>
          <Icon name="wode_qianbao_mingxi_sign_nor" color="#278AF1" width={10} height={7} />
          <Text style={{color: '#278AF1', fontSize: 12, marginLeft: 5}}>已领取</Text>
        </View>
      );
    } else if (commentStatus === UserIncomeState.COMMENT_EXPIRED) {
      commentIcon = (
        <View style={[styles.statusWrapper, {backgroundColor: '#9999991a'}]}>
          <Icon name="wode_qianbao_mingxi_sign_notice" color="#999" width={3} height={10} />
          <Text style={{color: '#999', fontSize: 12, marginLeft: 5}}>已过期</Text>
        </View>
      );
    } else {
      commentIcon = (
        <View style={[styles.statusWrapper, {backgroundColor: '#FF77151a'}]}>
          <Icon name="wode_qianbao_mingxi_sign_notice" color="#FF7715" width={3} height={10} />
          <Text style={{color: '#FF7715', fontSize: 12, marginLeft: 5}}>待领取</Text>
        </View>
      );
    }
  }
  const showCheckStaging = moneyList.some(item => item.status === UserIncomeState.UNCHECKED);
  const showLevelStaging = moneyList.some(item => item.status === UserIncomeState.LEVEL_STAGING);
  const showCommentTip = !!incomeOrder?.commentInfo && incomeOrder?.boughtItSelf === BoolEnum.TRUE && !!incomeOrder?.commentRedPackageNeedTimeInt;
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    if (!orderSmallId) {
      return;
    }
    api.user.getIncomeDetail(orderSmallId).then(setIncomeOrder).catch(commonDispatcher.error);
  }, [commonDispatcher, orderSmallId]);
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="收益详情" />
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <ScrollView style={{flex: 1}}>
          {!incomeOrder ? (
            <Loading />
          ) : (
            <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER}}>
              <View style={[globalStyles.containerRow]}>
                <MyImage source={{uri: incomeOrder.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 20, height: 20, borderRadius: 20}} />
                <Text style={{marginHorizontal: 5, fontSize: 15, color: globalStyleVariables.COLOR_LINK}}>{incomeOrder.nickName}</Text>
                {incomeOrder.boughtItSelf === BoolEnum.TRUE && (
                  <View style={[globalStyles.containerCenter, styles.mineTag]}>
                    <Text style={[styles.tagText, {color: '#fff'}]}>自己</Text>
                  </View>
                )}
              </View>
              <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                <Text style={[{fontSize: 15, fontWeight: '600', color: cashColor}]}>{commissionText}</Text>
                {incomeOrder.fromTeam === BoolEnum.TRUE && (
                  <View style={[globalStyles.containerCenter, styles.teamTag, {marginLeft: 5}]}>
                    <Text style={[styles.tagText, {color: globalStyleVariables.COLOR_PRIMARY}]}>团队</Text>
                  </View>
                )}
              </View>
              <Text style={{color: cashColor, marginTop: 20}}>
                {!refund && <Text style={{fontSize: 15}}>+</Text>}
                <Text style={{fontSize: 30}}>{incomeOrder.moneyYuan}</Text>
              </Text>
              <View style={[{marginTop: 40}, globalStyles.lineHorizontal]} />
              <View style={[globalStyles.containerLR, {paddingVertical: 20}]}>
                <Text style={[styles.textLabel, {flex: 1}]}>商品</Text>
                <Text style={[styles.textValue, {flex: 1}]} numberOfLines={2}>
                  {incomeOrder.spuName}
                </Text>
              </View>
              <View style={[globalStyles.lineHorizontal]} />
              {moneyList.map((commission, index) => {
                let icon = null as React.ReactElement;
                const {status} = commission;
                if (showIcon) {
                  if (status === UserIncomeState.CHECKED) {
                    icon = (
                      <View style={[styles.statusWrapper, {backgroundColor: '#278af11a'}]}>
                        <Icon name="wode_qianbao_mingxi_sign_nor" color="#278AF1" width={10} height={7} />
                        <Text style={{color: '#278AF1', fontSize: 12, marginLeft: 5}}>已领取</Text>
                      </View>
                    );
                  } else {
                    icon = (
                      <View style={[styles.statusWrapper, {backgroundColor: '#ff77151a'}]}>
                        <Icon name="wode_qianbao_mingxi_sign_notice" color="#FF7715" width={3} height={10} />
                        {status === UserIncomeState.UNCHECKED && <Text style={{color: '#FF7715', fontSize: 12, marginLeft: 5}}>核销暂存</Text>}
                        {status === UserIncomeState.LEVEL_STAGING && <Text style={{color: '#FF7715', fontSize: 12, marginLeft: 5}}>等级暂存</Text>}
                      </View>
                    );
                  }
                }
                return (
                  <View key={index} style={[globalStyles.containerLR, {marginTop: 20}]}>
                    <View style={[globalStyles.containerRow]}>
                      <Text style={styles.textLabel}>{commission.title}</Text>
                      {icon}
                    </View>
                    <Text style={styles.textValue}>{commission.moneyYuan}</Text>
                  </View>
                );
              })}
              <View style={[globalStyles.containerLR, {marginTop: 20}]}>
                <View style={[globalStyles.containerRow]}>
                  <Text style={styles.textLabel}>{incomeOrder?.commentInfo?.title}</Text>
                  {commentIcon}
                </View>
                <Text style={styles.textValue}>{incomeOrder?.commentInfo?.moneyYuan}</Text>
              </View>
              <View style={[globalStyles.lineHorizontal, {marginTop: 20}]} />
              <View style={[globalStyles.containerLR, {marginTop: 20}]}>
                <Text style={styles.textLabel}>订单创建时间</Text>
                <Text style={styles.textValue}>{incomeOrder.createdTime}</Text>
              </View>
              {incomeOrder.refundTime && (
                <View style={[globalStyles.containerLR, {marginTop: 20}]}>
                  <Text style={styles.textLabel}>订单退款时间</Text>
                  <Text style={styles.textValue}>{incomeOrder.refundTime}</Text>
                </View>
              )}
              <View style={{marginTop: 20}}>
                {showCheckStaging && (
                  <View style={[styles.explainItem]}>
                    <Text style={[styles.explainText]}>
                      核销暂存：当您自己购买或分享商品给朋友成功购买但未核销使用时，会暂存此部分订单佣金，订单核销后即可解锁到账；如果用户退款，佣金也会一并退回。
                    </Text>
                  </View>
                )}
                {showLevelStaging && (
                  <View style={[styles.explainItem]}>
                    <Text style={[styles.explainText]}>
                      等级暂存：当您的团队成员成功分享一单后，会给予您一份【躺赚佣金】，由于您现在达人等级未到【资深达人】，暂时无法提取此部分佣金。
                    </Text>
                  </View>
                )}
                {showCommentTip && (
                  <View style={[styles.explainItem]}>
                    <Text style={[styles.explainText]}>
                      {incomeOrder?.commentInfo?.title}：当您的订单完成后，及时（{incomeOrder.commentRedPackageNeedTimeInt}天内）发布客观合理的真实评论，系统审核通过后
                      {incomeOrder?.commentInfo?.title}就会到账啦；超过{incomeOrder.commentRedPackageNeedTimeInt}天{incomeOrder?.commentInfo?.title}即过期，不可再领取哦。
                    </Text>
                  </View>
                )}
                {showLevelStaging && (
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Profile')}>
                    <Text style={{textAlign: 'right', color: globalStyleVariables.COLOR_LINK}}>如何升级达人？</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default IncomeOrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textLabel: {
    fontSize: 15,
    // flex: 1,
    fontWeight: '500',
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
  textValue: {
    textAlign: 'right',
    // flex: 1,
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  statusWrapper: {
    marginLeft: 5,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 3,
  },
  explainItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
  },
  explainText: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    lineHeight: 30,
    fontSize: 12,
    fontWeight: '500',
  },
});
