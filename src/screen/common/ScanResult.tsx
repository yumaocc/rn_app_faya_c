import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useCommonDispatcher, useParams} from '../../helper/hooks';
import Clipboard from '@react-native-clipboard/clipboard';
import MyStatusBar from '../../component/MyStatusBar';

const ScanResult: React.FC = () => {
  const params = useParams<{content: string}>();
  const [commonDispatcher] = useCommonDispatcher();

  function handleCopy() {
    if (params.content) {
      Clipboard.setString(params.content);
      commonDispatcher.info('复制成功');
    }
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="扫描结果" />
      <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, marginTop: 10}}>
        <Text>此内容不是由发芽提供，如需使用，请复制内容</Text>
      </View>
      <View style={[{paddingHorizontal: 20}]}>
        <View style={styles.content}>
          <View style={[styles.text]}>
            <Text>{params.content}</Text>
          </View>

          <View style={[globalStyles.containerCenter, {marginTop: 10}]}>
            <Button title="复制" onPress={handleCopy} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScanResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    marginTop: 10,
  },
  text: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
});
