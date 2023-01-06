import React from 'react';
import {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {NavigationBar} from '../../../component';
import Loading from '../../../component/Loading';
import MyStatusBar from '../../../component/MyStatusBar';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import {FakeNavigation, TeamMemberF} from '../../../models';
import * as api from '../../../apis';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
// import MyImage from '../../../component/MyImage';
import Icon from '../../../component/Icon';
import {useNavigation} from '@react-navigation/native';

const TeamMemberDetail: React.FC = () => {
  const {shareSnowId} = useParams<{shareSnowId: string}>();
  const [memberDetail, setMemberDetail] = React.useState<TeamMemberF>(null);
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    api.user.teamMemberDetail(shareSnowId).then(setMemberDetail).catch(commonDispatcher.error);
  }, [commonDispatcher.error, shareSnowId]);

  function goUserDetail() {
    const userId = memberDetail?.userId;
    navigation.navigate({
      name: 'User',
      params: {id: userId},
      key: 'User-' + userId, // 每次去往个人中心需要新建一个key，否则会返回之前的页面
    });
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <Image source={require('../../../assets/agent-gradient-yellow.png')} style={[styles.bg]} resizeMode="stretch" />
      <Image source={require('../../../assets/agent-gold-coin.png')} style={[styles.bgImage]} resizeMode="cover" />
      <NavigationBar title="" />
      {!memberDetail ? (
        <Loading style={{marginTop: 120}} />
      ) : (
        <View style={{paddingTop: 20, flex: 1}}>
          <TouchableOpacity activeOpacity={0.8} onPress={goUserDetail}>
            <View style={[globalStyles.containerRow, styles.baseInfo]}>
              <Image source={{uri: memberDetail?.avatar}} defaultSource={require('../../../assets/avatar_def.png')} style={{width: 90, height: 90, borderRadius: 90}} />
              <View style={[{flex: 1, marginHorizontal: 10}]}>
                <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{memberDetail?.nickName}</Text>
                <Text style={[globalStyles.fontTertiary, {marginTop: 5}]}>{memberDetail?.invitedTime}</Text>
                <Text style={[globalStyles.fontTertiary, {marginTop: 5}]}>通过组队码加入团队</Text>
              </View>
              <Icon name="all_arrowR36" size={18} color="#999" />
            </View>
          </TouchableOpacity>
          <View style={styles.commissionInfo}>
            <View>
              <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>今日带来收益</Text>
            </View>
            <View>
              <Text style={[globalStyles.fontPrimary]}>
                <Text style={[{fontSize: 30}]}>{memberDetail?.todayEarningsYuan}</Text>
                <Text style={[{fontSize: 12}]}>芽</Text>
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={[globalStyles.lineHorizontal]} />
            <View style={styles.divider} />
            <View>
              <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>带来团队总收益</Text>
            </View>
            <View>
              <Text style={[globalStyles.fontPrimary]}>
                <Text style={[{fontSize: 30}]}>{memberDetail?.totalEarningsYuan}</Text>
                <Text style={[{fontSize: 12}]}>芽</Text>
              </Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>TA的团队</Text>
            </View>
            <View>
              <Text style={[globalStyles.fontPrimary]}>
                <Text style={[{fontSize: 30}]}>{memberDetail?.hisTeamSize}</Text>
                <Text style={[{fontSize: 12}]}>人</Text>
              </Text>
            </View>
          </View>
          <View style={styles.tipInfo}>
            <Text style={[globalStyles.fontTertiary, {textAlign: 'center'}]}>
              <Text>收益已存入</Text>
              <Text style={{color: globalStyleVariables.COLOR_LINK}} onPress={() => navigation.navigate('WalletSummaryAgent')}>
                钱包
              </Text>
              <Text>，可直接提现或用于购物抵扣</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TeamMemberDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 210,
    height: 210,
  },
  baseInfo: {
    paddingHorizontal: 23,
  },
  divider: {
    height: 30,
  },
  commissionInfo: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  tipInfo: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    width: '100%',
  },
});
