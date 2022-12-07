import React from 'react';
import {View, Text, TouchableHighlight, Platform} from 'react-native';
import {Popup} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {SupportMapAppName} from '../../models';

interface NavigationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: SupportMapAppName) => void;
}

const NavigationModal: React.FC<NavigationModalProps> = props => {
  function handleClose() {
    props.onClose();
  }

  function selectApp(appName: SupportMapAppName) {
    props.onSelect(appName);
    props.onClose();
  }

  return (
    <Popup visible={props.visible} onClose={handleClose} round={globalStyleVariables.RADIUS_MODAL}>
      <View style={{paddingVertical: 10}}>
        <TouchableHighlight
          underlayColor="#999"
          onPress={() => {
            selectApp('amap');
          }}>
          <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
            <Text style={[globalStyles.fontPrimary]}>高德地图</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#999"
          onPress={() => {
            selectApp('qq');
          }}>
          <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
            <Text style={[globalStyles.fontPrimary]}>腾讯地图</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#999"
          onPress={() => {
            selectApp('baidu');
          }}>
          <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
            <Text style={[globalStyles.fontPrimary]}>百度地图</Text>
          </View>
        </TouchableHighlight>
        {Platform.OS === 'ios' && (
          <TouchableHighlight
            underlayColor="#999"
            onPress={() => {
              selectApp('apple');
            }}>
            <View style={[{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
              <Text style={[globalStyles.fontPrimary]}>苹果地图</Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
    </Popup>
  );
};

export default NavigationModal;
