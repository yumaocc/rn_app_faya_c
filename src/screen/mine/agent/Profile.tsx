import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, TouchableHighlight, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationBar, OperateItem} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import Icon from '../../../component/Icon';
import {AgentHomeInfo} from '../../../models';
import * as api from '../../../apis';
import {dictAgentLevel} from '../../../helper/dictionary';
import {getValidPercent} from '../../../fst/helper';
import MyStatusBar from '../../../component/MyStatusBar';

const Profile: React.FC = () => {
  const [agentInfo, setAgentInfo] = useState<AgentHomeInfo>(null);
  const {bottom} = useSafeAreaInsets();
  const [opacity, setOpacity] = useState(0);
  const navigationBg = useMemo(() => {
    return `rgba(255, 255, 255, ${opacity})`;
  }, [opacity]);
  const navigationColor = useMemo(() => {
    return opacity > 0.5 ? '#000' : '#fff';
  }, [opacity]);

  // const detail = useSelector((state: RootState) => state.user.myDetail);
  const progress = useMemo(() => {
    if (!agentInfo) {
      return 0;
    }
    const {developNewUsersMax, developNewUsers, shareCompletedOrderMax, shareCompletedOrder} = agentInfo;
    const percent = ((developNewUsers + shareCompletedOrder) / (developNewUsersMax + shareCompletedOrderMax)) * 100;
    return getValidPercent(percent);
  }, [agentInfo]);
  const newUserTaskCompleted = useMemo(() => agentInfo?.developNewUsers >= agentInfo?.developNewUsersMax, [agentInfo]);
  const newOrderTaskCompleted = useMemo(() => agentInfo?.shareCompletedOrder >= agentInfo?.shareCompletedOrderMax, [agentInfo]);
  // 可享受权益数量
  const rightCount = useMemo(() => {
    if (!agentInfo?.level) {
      return 0;
    }
    switch (agentInfo.level) {
      case 1:
        return 2;
      case 2:
        return 3;
      case 3:
        return 4;
      default:
        return 0;
    }
  }, [agentInfo]);

  const hasLevel2Right = useMemo(() => agentInfo?.level >= 2, [agentInfo]);
  const hasLevel3Right = useMemo(() => agentInfo?.level >= 3, [agentInfo]);

  const [commonDispatcher] = useCommonDispatcher();
  // const {top} = useSafeAreaInsets();

  useEffect(() => {
    api.user
      .agentInfo()
      .then(res => {
        setAgentInfo(res);
      })
      .catch(e => {
        commonDispatcher.error(e);
      });
  }, [commonDispatcher]);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const threshold = 100;
    let {y} = e.nativeEvent.contentOffset;
    y = Math.min(threshold, y);
    const opacity = y / threshold;
    setOpacity(opacity);
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="达人主页" color={navigationColor} style={[{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 3, backgroundColor: navigationBg}]} />
      <MyStatusBar barStyle="light-content" />
      <ScrollView style={{flex: 1}} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{position: 'relative'}} bounces={false}>
        {agentInfo?.level === 1 && <Image source={require('../../../assets/img_darenbg_xinshou.png')} style={styles.cover} />}
        {agentInfo?.level === 2 && <Image source={require('../../../assets/img_darenbg_jinjie.png')} style={styles.cover} />}
        {agentInfo?.level === 3 && <Image source={require('../../../assets/img_darenbg_zishen.png')} style={styles.cover} />}

        <View style={[styles.container, {paddingTop: 170, paddingBottom: bottom}]}>
          <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#f4f4f4'}}>
            {/* 头像栏 */}
            <View style={[styles.userData]}>
              <View style={styles.avatarContainer}>
                <TouchableWithoutFeedback>
                  <View style={{alignItems: 'center'}}>
                    {!!agentInfo?.avatar && <Image style={[styles.avatar]} source={{uri: agentInfo?.avatar}} />}
                    {!agentInfo?.avatar && <Image style={[styles.avatar]} source={require('../../../assets/avatar_def.png')} />}
                    {agentInfo?.level === 1 && <Image source={require('../../../assets/tag_darensign_xinshou.png')} style={styles.agentBadge} />}
                    {agentInfo?.level === 2 && <Image source={require('../../../assets/tag_darensign_jinjie.png')} style={styles.agentBadge} />}
                    {agentInfo?.level === 3 && <Image source={require('../../../assets/tag_darensign_zishen.png')} style={styles.agentBadge} />}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{agentInfo?.cumulativeOrders}</Text>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 11}]}>累计订单（笔）</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{agentInfo?.cumulativeIncomeYuan}</Text>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 11}]}>累计收益（元）</Text>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
              {/* 团队情况 */}
              {hasLevel2Right && (
                <View style={[styles.card]}>
                  <OperateItem label="我的推广码" showArrow>
                    <Icon name="wode_erweima48" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  </OperateItem>
                  <View style={globalStyles.lineHorizontal} />
                  <OperateItem label="我的团队">
                    <Text style={globalStyles.fontPrimary}>{agentInfo?.developNewUsers || '-'}人</Text>
                  </OperateItem>
                </View>
              )}
              {/* 任务面板 */}
              {!hasLevel3Right && (
                <View style={styles.card}>
                  <TouchableHighlight underlayColor="#999" onPress={() => {}}>
                    <View style={{padding: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff'}}>
                      <View style={[globalStyles.containerLR]}>
                        <View style={[globalStyles.containerRow]}>
                          <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{dictAgentLevel(agentInfo?.level)}</Text>
                          <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                        </View>
                        <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>{dictAgentLevel(agentInfo?.level + 1)}</Text>
                      </View>
                      {/* 经验条 */}
                      <View style={{backgroundColor: '#0000001A', height: 4, marginTop: globalStyleVariables.MODULE_SPACE}}>
                        <View style={{backgroundColor: globalStyleVariables.COLOR_BUD, height: 4, width: progress + '%'}} />
                      </View>
                      {/* 任务完成情况 */}
                      <View style={[{marginTop: globalStyleVariables.MODULE_SPACE}]}>
                        <View style={[globalStyles.containerRow]}>
                          {newUserTaskCompleted ? (
                            <Icon name="task_complete_true" size={18} color={globalStyleVariables.COLOR_BUD} />
                          ) : (
                            <Icon name="task_complete_false" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                          )}
                          <Text
                            style={[
                              globalStyles.fontPrimary,
                              styles.taskName,
                              {color: newUserTaskCompleted ? globalStyleVariables.COLOR_BUD : globalStyleVariables.TEXT_COLOR_PRIMARY},
                            ]}>
                            发展新用户{`（${Math.min(agentInfo?.developNewUsers, agentInfo?.developNewUsersMax) ?? '-'}/${agentInfo?.developNewUsersMax ?? '-'}）`}
                          </Text>
                        </View>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
                          {newOrderTaskCompleted ? (
                            <Icon name="task_complete_true" size={18} color={globalStyleVariables.COLOR_BUD} />
                          ) : (
                            <Icon name="task_complete_false" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                          )}
                          <Text
                            style={[
                              globalStyles.fontPrimary,
                              styles.taskName,
                              {color: newOrderTaskCompleted ? globalStyleVariables.COLOR_BUD : globalStyleVariables.TEXT_COLOR_PRIMARY},
                            ]}>
                            分享商品完成订单交易
                            {`（${Math.min(agentInfo?.shareCompletedOrder, agentInfo?.shareCompletedOrderMax) ?? '-'}/${agentInfo?.shareCompletedOrderMax ?? '-'}）`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              )}
              {/* 权益面板 */}
              <View style={styles.card}>
                <View style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
                  <View style={[globalStyles.containerLR]}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>我的权益</Text>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                      <Text style={{fontSize: 18}}>{rightCount}</Text>
                      <Text> / 4</Text>
                    </Text>
                  </View>
                  <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE}]} />
                  {/* 权益内容 */}
                  {/* 一级权益 */}
                  <View>
                    <View style={[styles.rightItem, {marginTop: 0}]}>
                      <Image source={require('../../../assets/icon_daren_01.png')} style={styles.rightIcon} />
                      <View style={styles.rightContent}>
                        <Text style={styles.rightName}>橱窗</Text>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, alignItems: 'flex-start'}]}>
                          <View style={[globalStyles.containerCenter, {height: 18, width: 18}]}>
                            <View style={styles.dot} />
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={[globalStyles.fontTertiary, {lineHeight: 18}]}>将商品加入橱窗，当橱窗商品销售完成后可以获取【带货佣金】</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.rightItem]}>
                      <Image source={require('../../../assets/icon_daren_02.png')} style={styles.rightIcon} />
                      <View style={styles.rightContent}>
                        <Text style={styles.rightName}>分享赚佣</Text>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, alignItems: 'flex-start'}]}>
                          <View style={[globalStyles.containerCenter, {height: 18, width: 18}]}>
                            <View style={styles.dot} />
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={[globalStyles.fontTertiary, {lineHeight: 18}]}>分享商品，当订单完成后可以获取【直售佣金】</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* 二级权益 */}
                  {!hasLevel2Right && (
                    <View style={[globalStyles.containerRow, {marginTop: 20}]}>
                      <View style={{flex: 1, backgroundColor: '#0000001A', height: StyleSheet.hairlineWidth}} />
                      <Text style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_BUD}]}>升级进阶达人后解锁</Text>
                      <View style={{flex: 1, backgroundColor: '#0000001A', height: StyleSheet.hairlineWidth}} />
                    </View>
                  )}
                  <View style={{opacity: hasLevel2Right ? 1 : 0.5}}>
                    <View style={[styles.rightItem]}>
                      <Image source={require('../../../assets/icon_daren_03.png')} style={styles.rightIcon} />
                      <View style={styles.rightContent}>
                        <Text style={styles.rightName}>推广码</Text>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, alignItems: 'flex-start'}]}>
                          <View style={[globalStyles.containerCenter, {height: 18, width: 18}]}>
                            <View style={styles.dot} />
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={[globalStyles.fontTertiary, {lineHeight: 18}]}>可以组建团队，当团队成员分享商品完成订单后，你会获得一份【躺赚佣金】</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* 三级权益 */}
                  {!hasLevel3Right && (
                    <View style={[globalStyles.containerRow, {marginTop: 20}]}>
                      <View style={{flex: 1, backgroundColor: '#0000001A', height: StyleSheet.hairlineWidth}} />
                      <Text style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_BUD}]}>升级资深达人后解锁</Text>
                      <View style={{flex: 1, backgroundColor: '#0000001A', height: StyleSheet.hairlineWidth}} />
                    </View>
                  )}
                  <View style={{opacity: hasLevel3Right ? 1 : 0.5}}>
                    <View style={[styles.rightItem]}>
                      <Image source={require('../../../assets/icon_daren_04.png')} style={styles.rightIcon} />
                      <View style={styles.rightContent}>
                        <Text style={styles.rightName}>额外佣金</Text>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, alignItems: 'flex-start'}]}>
                          <View style={[globalStyles.containerCenter, {height: 18, width: 18}]}>
                            <View style={styles.dot} />
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={[globalStyles.fontTertiary, {lineHeight: 18}]}>分享商品，当订单完成后可以获取【直售佣金】+【躺赚佣金】</Text>
                          </View>
                        </View>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, alignItems: 'flex-start'}]}>
                          <View style={[globalStyles.containerCenter, {height: 18, width: 18}]}>
                            <View style={styles.dot} />
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={[globalStyles.fontTertiary, {lineHeight: 18}]}>解锁【躺赚佣金】提现</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
  userData: {
    height: 83,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  agentBadge: {
    width: 93,
    height: 24,
    position: 'absolute',
    bottom: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: globalStyleVariables.MODULE_SPACE,
    overflow: 'hidden',
  },
  taskName: {
    marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  rightIcon: {
    width: 50,
    height: 50,
  },
  rightContent: {
    flex: 1,
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  rightName: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
});
