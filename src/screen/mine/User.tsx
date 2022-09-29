import React from 'react';
import {Icon} from '@ant-design/react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Tabs} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
// import { goLogin } from '../../router/Router';

const User: React.FC = () => {
  const items = [
    {
      title: '作品',
      key: 'work',
    },
    {
      title: '喜欢',
      key: 'like',
    },
  ];

  function handleCopy() {}

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{position: 'relative'}}>
        <Image source={require('../../assets/mine-bg.png')} style={styles.cover} />
        <View style={[styles.container, {paddingTop: 170}]}>
          <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#fff'}}>
            {/* 头像栏 */}
            <View style={[styles.userData]}>
              {/* {!!detail.avatar && <Image style={[styles.avatar]} source={{uri: detail.avatar}} />} */}
              {true && <Image style={[styles.avatar]} source={require('../../assets/avatar_def.png')} />}
              <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                <View style={{alignItems: 'center', flex: 1}}>
                  {/* <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.fansNums}</Text> */}
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{0}</Text>
                  <Text style={[globalStyles.fontPrimary]}>粉丝</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  {/* <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.followNums}</Text> */}
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{0}</Text>
                  <Text style={[globalStyles.fontPrimary]}>关注</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  {/* <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{detail?.nums?.likeNums}</Text> */}
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{0}</Text>
                  <Text style={[globalStyles.fontPrimary]}>获赞</Text>
                </View>
              </View>
            </View>

            {/* 用户基本信息栏 */}
            <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <View style={globalStyles.containerRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {/* {detail?.nickName} */}
                  成都美食家
                </Text>
              </View>
              {true && (
                <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                  {/* <Text style={[globalStyles.fontPrimary]}>发芽号：{detail?.account}</Text> */}
                  <Text style={[globalStyles.fontPrimary]}>发芽号：25r6478a6te7324</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={handleCopy}>
                    <Icon name="copy" size={18} color="#ccc" style={{marginLeft: 10}} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={globalStyles.halfModuleMarginTop}>
                <Text style={globalStyles.fontSecondary} numberOfLines={1}>
                  {/* {detail?.say} */}
                  一只喜欢吃美食的小仙女
                </Text>
              </View>
            </View>

            {true && (
              <>
                {/* 订单入口栏 */}
                <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                  <TouchableOpacity activeOpacity={0.8} style={{flex: 1}}>
                    <View style={[globalStyles.containerRow]}>
                      <View style={[globalStyles.containerCenter, styles.entry]}>
                        <MaterialIcon name="store" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                      </View>
                      <Text>橱窗</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* 作品分类 */}
                <Tabs tabs={items} showIndicator style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}} />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default User;

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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  entry: {
    width: 60,
    height: 60,
    backgroundColor: '#00000008',
    marginRight: 10,
    borderRadius: 5,
  },
});
