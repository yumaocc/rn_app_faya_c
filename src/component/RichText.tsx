import React from 'react';
import {Platform} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
// import AutoHeightWebView from 'react-native-autoheight-webview';
import {StylePropView} from '../models';

interface RichTextProps {
  content: string;
  style?: StylePropView;
}

const RichText: React.FC<RichTextProps> = props => {
  const [height, setHeight] = React.useState(800);

  function onMessage(e: WebViewMessageEvent) {
    const height = e.nativeEvent.data;
    setHeight(Number(height) + 10);
  }
  const fitPage = Platform.OS === 'ios';
  const webViewSource: {html: string; baseUrl?: string} = {
    html: props.content,
  };
  if (!fitPage) {
    webViewSource.baseUrl = '';
  }
  return (
    <WebView
      userAgent="RNWebView"
      scalesPageToFit={fitPage}
      source={webViewSource}
      style={[props.style, {width: '100%', height, opacity: 0.99}]}
      javaScriptEnabled
      onMessage={onMessage}
      injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.setAttribute('content', 'width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0,user-scalable=no');
          meta.setAttribute('name', 'viewport');
          document.getElementsByTagName('head')[0].appendChild(meta);
          const style = document.createElement('style');
          style.type='text/css';
          style.innerHTML = 'html,body{padding:0;margin:0;}img{max-width:100%;height:auto;}';
          document.getElementsByTagName('head')[0].appendChild(style);
          // alert("mmm");
          setTimeout(function() {
            window.ReactNativeWebView.postMessage(window.document.body.scrollHeight);
          }, 100);
          true;
        `}
    />
  );
};

export default RichText;
RichText.defaultProps = {
  style: {},
};
