import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {Button} from '../../component';
import {readQRCodeContent} from '../../helper/system';
import {FakeNavigation} from '../../models';

const Scanner: React.FC = () => {
  const [active, setActive] = React.useState(true);

  const navigation = useNavigation<FakeNavigation>();
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  function stopScan() {
    setActive(false);
  }

  useEffect(() => {
    if (isFocused) {
      setActive(true);
    }
    return () => {
      setActive(false);
    };
  }, [isFocused]);

  useEffect(() => {
    if (barcodes.length) {
      const res = readQRCodeContent(barcodes[0].displayValue);
      const {type, data} = res;
      switch (type) {
        case 'share':
          // todo: 推广码，去注册
          // navigation.replace({
          //   name: 'Login',
          //   params: {id: data.userId},
          // });
          return;
        case 'friend':
          stopScan();
          // navigation.canGoBack() && navigation.goBack();
          // navigation.na('User', {id: data.userId});
          navigation.navigate({
            name: 'User',
            params: {id: data.userId},
            key: 'User-' + data.userId,
          });
          return;
        case 'other':
          break;
      }
      stopScan();
    }
  }, [barcodes, navigation]);

  if (!device || !hasPermission) {
    return (
      <View style={styles.loading}>
        <Text>未找到可用相机或您未开启相机使用权限</Text>
        <Button style={{marginTop: 30}} type="primary" onPress={() => navigation.canGoBack() && navigation.goBack()} title="返回" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Camera style={styles.camera} device={device} isActive={active} frameProcessorFps={5} frameProcessor={frameProcessor} />
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
