import {Icon} from '@ant-design/react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {Tabs} from '../../component';

const Mine: React.FC = () => {
  const {top} = useSafeAreaInsets();

  const items = [
    {
      title: '作品',
      key: 'work',
    },
    {
      title: '私密',
      key: 'private',
    },
    {
      title: '喜欢',
      key: 'like',
    },
    {
      title: '收藏',
      key: 'collection',
    },
  ];

  function handleCopy() {
    console.log('copy');
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{position: 'relative'}}>
        <Image source={{uri: 'https://fakeimg.pl/50?text=loading'}} style={styles.cover} />
        <View style={[styles.container, {paddingTop: 170}]}>
          {/* 顶部扫码等按钮栏 */}
          <View style={[globalStyles.containerLR, {position: 'absolute', top: top + 20, width: '100%', paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <Icon name="scan" size={24} color="#fff" />
            <View style={globalStyles.containerLR}>
              <Icon name="qrcode" size={24} color="#fff" />
              <Icon name="menu" size={24} color="#fff" style={{marginLeft: globalStyleVariables.MODULE_SPACE}} />
            </View>
          </View>
          <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#fff'}}>
            {/* 头像栏 */}
            <View style={[styles.userData]}>
              <View style={[styles.avatar]} />
              <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>9999</Text>
                  <Text style={[globalStyles.fontPrimary]}>粉丝</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>9.3w</Text>
                  <Text style={[globalStyles.fontPrimary]}>关注</Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>1.6w</Text>
                  <Text style={[globalStyles.fontPrimary]}>获赞</Text>
                </View>
              </View>
            </View>

            {/* 用户基本信息栏 */}
            <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <Text style={styles.userName} numberOfLines={1}>
                成都美食观察者
              </Text>
              <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                <Text style={[globalStyles.fontPrimary]}>发芽号：132412wantfaut1as</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={handleCopy}>
                  <Icon name="copy" size={18} color="#ccc" style={{marginLeft: 10}} />
                </TouchableOpacity>
              </View>
              <View style={globalStyles.halfModuleMarginTop}>
                <Text style={globalStyles.fontSecondary} numberOfLines={1}>
                  {'介绍内容'.repeat(20)}
                </Text>
              </View>
            </View>

            {/* 订单入口栏 */}
            <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <TouchableOpacity activeOpacity={0.8} style={{flex: 1}}>
                <View style={[globalStyles.containerRow]}>
                  <View style={[globalStyles.containerCenter, styles.entry]}>
                    <MaterialIcon name="assignment" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                  </View>
                  <Text>订单</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={{flex: 1}}>
                <View style={[globalStyles.containerRow]}>
                  <View style={[globalStyles.containerCenter, styles.entry]}>
                    <MaterialIcon name="account-balance-wallet" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                  </View>
                  <Text>钱包</Text>
                </View>
              </TouchableOpacity>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
Mine.defaultProps = {
  title: 'Mine',
};
export default Mine;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
    backgroundColor: '#6cf',
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
