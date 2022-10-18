import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, StatusBar} from 'react-native';
import {NavigationBar} from '../../component';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {SwipeAction} from '@ant-design/react-native';
import {useIsFocused} from '@react-navigation/native';

const Notify: React.FC = () => {
  const isFocused = useIsFocused();

  function noop() {
    console.log(1);
  }

  function renderNewFriends() {
    return (
      <TouchableHighlight onPress={noop} underlayColor="#999">
        <View style={styles.listItem}>
          <View style={styles.listHeader}>
            <View style={[styles.avatar, {backgroundColor: '#55ADFF'}]}>
              <MaterialIcon name="person" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.listBody}>
            <View style={globalStyles.containerCol}>
              <Text style={[globalStyles.fontPrimary]}>新的朋友</Text>
              <Text style={[globalStyles.fontTertiary]}>快去添加朋友吧</Text>
            </View>
          </View>
          <MaterialIcon name="chevron-right" size={24} color="#999" />
        </View>
      </TouchableHighlight>
    );
  }

  // 互动消息
  function renderInteract() {
    return (
      <TouchableHighlight onPress={noop} underlayColor="#999">
        <View style={styles.listItem}>
          <View style={styles.listHeader}>
            <View style={[styles.avatar, {backgroundColor: '#61D288'}]}>
              <MaterialIcon name="notifications" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.listBody}>
            <View style={globalStyles.containerCol}>
              <Text style={[globalStyles.fontPrimary]}>互动消息</Text>
              <Text style={[globalStyles.fontTertiary]}>快去看看有什么新鲜好玩的吧~</Text>
            </View>
          </View>
          <MaterialIcon name="chevron-right" size={24} color="#999" />
        </View>
      </TouchableHighlight>
    );
  }
  // 橱窗消息
  function renderShowcase() {
    return (
      <TouchableHighlight onPress={noop} underlayColor="#999">
        <View style={styles.listItem}>
          <View style={styles.listHeader}>
            <View style={[styles.avatar, {backgroundColor: '#FFB979'}]}>
              <MaterialIcon name="storefront" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.listBody}>
            <View style={globalStyles.containerCol}>
              <Text style={[globalStyles.fontPrimary]}>橱窗消息</Text>
              <Text style={[globalStyles.fontTertiary]}>快去看看有什么新鲜好玩的吧~</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  // 系统通知
  function renderSystem() {
    return (
      <TouchableHighlight onPress={noop} underlayColor="#999">
        <View style={styles.listItem}>
          <View style={styles.listHeader}>
            <View style={[styles.avatar, {backgroundColor: '#FFB979'}]}>
              <MaterialIcon name="notifications" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.listBody}>
            <View style={globalStyles.containerRow}>
              <Text style={[globalStyles.fontPrimary]}>系统通知</Text>
              <View style={[globalStyles.tagWrapper, {backgroundColor: '#0000000D', marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
                <Text style={[globalStyles.tag, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>官方</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  function renderUserMessage(msg: string) {
    return (
      <SwipeAction
        right={[
          {text: '置顶', backgroundColor: '#FFAC60', color: '#fff'},
          {text: '删除', backgroundColor: '#f00', color: '#fff'},
        ]}>
        <TouchableHighlight onPress={noop} underlayColor="#999">
          <View style={styles.listItem}>
            <View style={styles.listHeader}>
              <View style={[styles.avatar, {backgroundColor: '#6cf'}]} />
            </View>
            <View style={[styles.listBody]}>
              <View style={[globalStyles.containerCol, {flex: 1}]}>
                <View style={[globalStyles.containerLR]}>
                  <Text style={[globalStyles.fontPrimary]}>超级男孩</Text>
                  <Text style={[globalStyles.fontTertiary]}>2022-11-05</Text>
                </View>
                <View style={{paddingRight: 10}}>
                  <Text numberOfLines={1} style={[globalStyles.fontTertiary, {fontSize: 13}]}>
                    {msg}
                  </Text>
                </View>
              </View>

              {/* <View style={[globalStyles.containerCol]}>
                <View>


                </View>
              </View> */}
            </View>
          </View>
        </TouchableHighlight>
      </SwipeAction>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && <StatusBar backgroundColor="#fff" barStyle="dark-content" />}
      <NavigationBar
        title="消息"
        canBack={false}
        headerLeft={false}
        headerRight={
          <TouchableOpacity activeOpacity={0.8}>
            <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
              <MaterialIcon name="add" size={25} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
            </View>
          </TouchableOpacity>
        }
      />
      <ScrollView style={{flex: 1}}>
        {renderNewFriends()}
        {renderInteract()}
        {renderShowcase()}
        {renderSystem()}
        {renderUserMessage('对啊，我昨天去了那家店，感觉很不错')}
        {renderUserMessage('对啊，我昨天去了那家店，感觉很不错。对啊，我昨天去了那家店，感觉很不错。')}
      </ScrollView>
    </View>
  );
};
export default Notify;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#fff',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },

  listHeader: {
    width: 50,
    height: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBody: {
    flex: 1,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    flexDirection: 'row',
  },
});
