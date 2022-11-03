import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {Button, NavigationBar} from '../../component';
import {parseLink} from '../../helper/system';
import {FakeNavigation, URLParseRule} from '../../models';
import * as api from '../../apis';
import {useCommonDispatcher} from '../../helper/hooks';
import qs from 'qs';
import MyStatusBar from '../../component/MyStatusBar';

const Scanner: React.FC = () => {
  const [active, setActive] = React.useState(true);

  const navigation = useNavigation<FakeNavigation>();
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [urlParserRule, setUrlParserRule] = React.useState<URLParseRule>(null);
  const [ruleIsReady, setRuleIsReady] = React.useState<boolean>(false);
  const [commonDispatcher] = useCommonDispatcher();

  const saveShareUser = useCallback(
    (userId: string | number) => {
      userId = String(userId);
      if (userId) {
        commonDispatcher.setConfig({shareUserId: userId});
      }
    },
    [commonDispatcher],
  );

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setActive(true);
    }
    return () => {
      setActive(false);
    };
  }, [isFocused]);

  const checkScanContent = useCallback(
    (content: string) => {
      let query: any = {};
      // 扫码结果如果有分享人的ID，保存
      try {
        const search = content.split('#')[0].split('?')[1];
        query = qs.parse(search, {ignoreQueryPrefix: true});
        saveShareUser(query.a);
      } catch (error) {}

      if (urlParserRule) {
        const res = parseLink(content, urlParserRule);
        const {type, data, isURL} = res;
        const a = data.a || data.userId;
        if (a) {
          commonDispatcher.setConfig({
            shareUserId: data.a || data.userId,
          });
        }

        switch (type) {
          case 'invite':
            navigation.navigate('Invite', {userId: data.userId});
            return;
          case 'friend':
            navigation.navigate({
              name: 'User',
              params: {id: data.userId},
            });
            return;
          case 'spu':
            const spuId = data.spuId;
            navigation.navigate({
              name: 'SPUDetail',
              params: {id: spuId},
              key: 'SPUDetail-' + spuId,
            });
            return;
          case 'work':
            const workId = data.workId;
            navigation.navigate('SingleWorkDetail', {id: workId});
            return;
          case 'home':
            navigation.canGoBack() && navigation.goBack();
            return;
          case 'unknown':
            if (isURL) {
              navigation.navigate('Browser', {url: res.content});
            } else {
              navigation.navigate('ScanResult', {content});
            }
            return;
        }
      } else {
        navigation.navigate('ScanResult', {content});
      }
    },
    [commonDispatcher, navigation, saveShareUser, urlParserRule],
  );

  useEffect(() => {
    api.common
      .getURLParser()
      .then(rule => {
        setUrlParserRule(rule);
        setRuleIsReady(true);
        // const link = 'https://m.faya.life?i=10&a=23#/invite/12';
        // console.log(parseLink(link, rule));
      })
      .catch(() => {
        setRuleIsReady(true);
      });
  }, []);

  useEffect(() => {
    if (barcodes.length) {
      const text = barcodes[0].displayValue;
      checkScanContent(text);
    }
  }, [barcodes, checkScanContent]);

  function handleBack() {
    navigation.canGoBack() && navigation.goBack();
    // checkScanContent('https://m.faya.life/?a=22#/spu/detail/65');
  }

  if (!device || !hasPermission || !ruleIsReady) {
    return (
      <View style={styles.loading}>
        <Text>未找到可用相机或您未开启相机使用权限</Text>
        <Button style={{marginTop: 30}} type="primary" onPress={handleBack} title="返回" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      <Camera style={styles.camera} device={device} isActive={active} frameProcessorFps={5} frameProcessor={frameProcessor} />
      <NavigationBar title="扫一扫" color="#fff" />
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});
