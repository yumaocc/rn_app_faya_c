import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationBar} from '../../component';
import {useParams} from '../../helper/hooks';
import {WebView} from 'react-native-webview';
import MyStatusBar from '../../component/MyStatusBar';

const Browser: React.FC = () => {
  const {url} = useParams<{url: string}>();
  const [title, setTitle] = React.useState('');
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title={title} />
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        onLoad={e => {
          setTitle(e.nativeEvent.title);
        }}
      />
    </View>
  );
};

export default Browser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
