import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useRefCallback} from '../../fst/hooks';
import {useCommonDispatcher, useParams} from '../../helper/hooks';
import QRCode from 'react-native-qrcode-svg';
import SwipeView, {SwipeDirection} from '../../component/SwipeView';
import * as api from '../../apis';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';

const MyCode: React.FC = () => {
  const {type} = useParams<{type: 'friend' | 'share'}>();
  const [currentType, setCurrentType] = React.useState<'friend' | 'share'>(type || 'friend');
  const {width: windowWidth} = useWindowDimensions();
  const [ref, setRef, isReady] = useRefCallback();
  const [codeInfo, setCodeInfo] = React.useState<{datingQrCodeUrl: string; shareQrCodeUrl: string}>();
  const userInfo = useSelector((state: RootState) => state.user.myDetail);

  const [commonDispatcher] = useCommonDispatcher();

  const checkCode = useCallback(async () => {
    try {
      const res = await api.user.getCodeUrl();
      // const {datingQrCodeUrl, shareQrCodeUrl} = res;
      setCodeInfo(res);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }, [commonDispatcher]);

  useEffect(() => {
    checkCode();
  }, [checkCode]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const index = currentType === 'friend' ? 0 : 1;
    setTimeout(() => {
      ref.current?.scrollTo({
        x: windowWidth * index,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentType, isReady, ref, windowWidth]);

  function handleSwipe(direction: SwipeDirection) {
    switch (direction) {
      case SwipeDirection.LEFT:
        setCurrentType('share');
        break;
      case SwipeDirection.RIGHT:
        setCurrentType('friend');
        break;
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
      <NavigationBar
        title={
          <View style={globalStyles.containerRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setCurrentType('friend')}>
              <Text style={[globalStyles.fontPrimary, {color: currentType === 'friend' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                交友二维码
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={{marginLeft: globalStyleVariables.MODULE_SPACE_BIGGER}} onPress={() => setCurrentType('share')}>
              <Text style={[globalStyles.fontPrimary, {color: currentType === 'share' ? globalStyleVariables.TEXT_COLOR_PRIMARY : globalStyleVariables.TEXT_COLOR_TERTIARY}]}>
                推广码
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView ref={setRef} horizontal style={{flex: 1}} snapToInterval={windowWidth} showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <SwipeView style={[styles.codeContainer, {width: windowWidth}]} onSwipe={handleSwipe}>
          {!userInfo?.avatar ? <Image style={styles.avatar} source={require('../../assets/avatar_def.png')} /> : <Image style={styles.avatar} source={{uri: userInfo.avatar}} />}
          <View style={{marginTop: 20}}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nickName}</Text>
          </View>
          <View style={{marginTop: 30}}>
            <QRCode value={codeInfo?.datingQrCodeUrl} size={250} />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={globalStyles.fontPrimary}>扫描二维码，立刻关注我</Text>
          </View>
          {/* <TouchableOpacity activeOpacity={0.8}>
            <View style={[styles.save]}>
              <MaterialIcon name="south" size={15} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />
              <Text style={[globalStyles.fontPrimary]}>保存到本地</Text>
            </View>
          </TouchableOpacity> */}
        </SwipeView>
        <SwipeView style={[styles.codeContainer, {width: windowWidth}]} onSwipe={handleSwipe}>
          {!userInfo?.avatar ? <Image style={styles.avatar} source={require('../../assets/avatar_def.png')} /> : <Image style={styles.avatar} source={{uri: userInfo.avatar}} />}
          <View style={{marginTop: 20}}>
            <Text style={[globalStyles.fontPrimary]}>{userInfo?.nickName}</Text>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>邀请你注册发芽</Text>
          </View>
          <View style={{marginTop: 30}}>
            <QRCode value={codeInfo?.shareQrCodeUrl} size={250} />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={globalStyles.fontPrimary}>扫描二维码，开启美好生活</Text>
          </View>
          {/* <TouchableOpacity activeOpacity={0.8}>
            <View style={[styles.save]}>
              <MaterialIcon name="south" size={15} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />
              <Text style={[globalStyles.fontPrimary]}>保存到本地</Text>
            </View>
          </TouchableOpacity> */}
        </SwipeView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MyCode;

const styles = StyleSheet.create({
  codeContainer: {
    // backgroundColor: '#6cf',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6cf',
    marginTop: 40,
  },
  save: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#0000000D',
    padding: 7,
    borderRadius: 5,
  },
});
