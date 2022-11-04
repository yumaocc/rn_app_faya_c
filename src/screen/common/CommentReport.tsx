import React, {useRef} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, NavigationBar} from '../../component';
import MyStatusBar from '../../component/MyStatusBar';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useCommonDispatcher, useParams} from '../../helper/hooks';
import * as api from '../../apis';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';

const CommentReport: React.FC = () => {
  const [content, setContent] = React.useState('');
  const {id} = useParams<{id: string}>();
  const ref = useRef<TextInput>();
  const [loading, setLoading] = React.useState(false);
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  async function handleSend() {
    ref.current?.blur();
    setLoading(true);
    try {
      await api.work.reportComment({
        id,
        content,
      });
      commonDispatcher.success('提交成功！');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      setLoading(false);
      commonDispatcher.error(error);
    }
  }
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="举报评论" />
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          <View style={styles.content}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>您的举报我们将尽快处理，请尽量提交完整的举报描述材料</Text>
            <View style={{marginTop: 20}}>
              <Text style={globalStyles.fontSecondary}>举报描述</Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                ref={ref}
                value={content}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                onChangeText={setContent}
                placeholder="请详细描述举报理由"
                multiline={true}
                style={styles.input}
              />
            </View>
          </View>
        </ScrollView>
        <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
          <Button title="提交" type="primary" disabled={!content} onPress={handleSend} loading={loading} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  input: {
    margin: 0,
    padding: 10,
    height: 140,
    backgroundColor: '#0000000D',
    borderRadius: 5,
  },
});
