import React, {memo, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  useWindowDimensions,
  Image,
  TouchableWithoutFeedback,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {Popup} from '../../../component';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {friendlyTime} from '../../../fst/helper/data';
import {useCommonDispatcher, useIsLoggedIn} from '../../../helper/hooks';
import * as api from '../../../apis';
import {SearchParam} from '../../../fst/models';
import {FakeNavigation, LoadListState, WorkComment} from '../../../models';
import {goLogin} from '../../../router/Router';
import {useNavigation} from '@react-navigation/native';
import {isReachBottom} from '../../../helper/system';

interface CommentModalProps {
  // visible: boolean;
  // onClose: () => void;
  onCommentAction?: (comment: WorkComment) => void; // 长按评论的操作
}
export interface CommentModalRef {
  openComment: (mainId: string, focusInput?: boolean) => void;
  close: () => void;
}

const CommentModal = React.forwardRef<CommentModalRef, CommentModalProps>((props, ref) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [commentMainId, setCommentMainId] = useState(''); // 当前评论的视频id
  const [comment, setComment] = useState<LoadListState<WorkComment>>({list: [], status: 'none', index: 0});
  const [modalComment, setModalComment] = useState(''); // 弹窗上的评论输入框内容
  const [autoFocusComment, setAutoFocusComment] = useState(false); // 是否自动聚焦评论输入框
  const navigation = useNavigation<FakeNavigation>();

  const commentInputRef = useRef<TextInput>(null);
  const [commonDispatcher] = useCommonDispatcher();
  const isLoggedIn = useIsLoggedIn();
  const {height} = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    openComment: (mainId: string, focusInput = false) => {
      openCommentModal(mainId, focusInput);
    },
    close: () => {
      setShowComment(false);
    },
  }));

  const loadComment = useCallback(
    async (params: SearchParam, replace = false) => {
      if (comment.status !== 'noMore' || replace) {
        const index = replace ? 1 : comment.index + 1;
        const pageSize = 20;
        try {
          const res = await api.work.getWorkCommentList({pageIndex: index, pageSize, ...params});
          const newComments: LoadListState<WorkComment> = {
            list: replace ? res : [...comment.list, ...res],
            status: res.length < pageSize ? 'noMore' : 'none',
            index,
          };
          console.log(newComments);
          setComment(newComments);
        } catch (error) {
          commonDispatcher.error(error);
        }
      }
    },
    [comment, commonDispatcher],
  );

  const openCommentModal = useCallback(
    (mainId: string, autoFocus = false) => {
      setAutoFocusComment(autoFocus);
      if (mainId !== commentMainId) {
        // 重置评论
        setCommentMainId(mainId);
        setComment({list: [], status: 'none', index: 0});
        loadComment({snowId: mainId}, true);
      }
      setShowComment(true);
    },
    [commentMainId, loadComment],
  );

  const sendModelComment = useCallback(async () => {
    Keyboard.dismiss();
    if (!isLoggedIn) {
      goLogin();
    }
    if (!modalComment) {
      return;
    }
    try {
      await api.work.commentWork({content: modalComment, id: commentMainId});
      loadComment({snowId: commentMainId}, true);
      setModalComment('');
    } catch (error) {
      commonDispatcher.error(error);
    }
  }, [commentMainId, commonDispatcher, loadComment, modalComment, isLoggedIn]);

  const handleCommentModalShow = useCallback(() => {
    if (autoFocusComment) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 0);
    }
  }, [autoFocusComment]);
  // 键盘处理
  useEffect(() => {
    const willShowSubscription = Keyboard.addListener('keyboardWillShow', e => {
      if (Platform.OS === 'ios') {
        setKeyboardHeight(e.endCoordinates.height);
      }
    });
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      if (Platform.OS === 'ios') {
        const {height} = e.endCoordinates;
        setKeyboardHeight(height);
      }
    });
    const willDismissSubscription = Keyboard.addListener('keyboardWillHide', () => {
      if (Platform.OS === 'ios') {
        setKeyboardHeight(0);
      }
    });
    const dismissSubscription = Keyboard.addListener('keyboardDidHide', () => {
      if (Platform.OS === 'ios') {
        setKeyboardHeight(0);
      }
    });
    return () => {
      showSubscription.remove();
      dismissSubscription.remove();
      willShowSubscription.remove();
      willDismissSubscription.remove();
    };
  }, []);

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isReachBottom(e) && isLoggedIn) {
      loadComment({snowId: commentMainId}, false);
    }
  }

  function onClickUserAvatar(id: number) {
    setShowComment(false);
    navigation.navigate({
      name: 'User',
      params: {id: id},
      key: 'User-' + id, // 每次去往个人中心需要新建一个key，否则会返回之前的页面
    });
  }

  if (!showComment) {
    return null;
  }
  return (
    <Popup
      visible={true}
      onClose={() => setShowComment(false)}
      style={[styles.commentModel, {height: height * 0.7 - Platform.select({android: keyboardHeight, ios: 0})}]}
      useNativeDrive={false}
      round={10}
      onShow={handleCommentModalShow}>
      <View style={{flex: 1, paddingBottom: Platform.select({android: 0, ios: keyboardHeight})}}>
        <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE, height: 40}]}>
          <View>
            <Text style={[globalStyles.fontPrimary]}>作品评论</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowComment(false)}>
            <Icon name="all_popclose36" size={18} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </TouchableOpacity>
        </View>
        {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}> */}
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag" onMomentumScrollEnd={handleScrollEnd} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            {/* TODO: 加上分页请求 */}
            {comment.list.map((comment, index) => {
              return (
                <View key={index} style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, marginVertical: globalStyleVariables.MODULE_SPACE}}>
                  <TouchableWithoutFeedback onLongPress={() => props.onCommentAction && props.onCommentAction(comment)}>
                    <View style={[globalStyles.containerRow, {alignItems: 'flex-start'}]}>
                      <TouchableOpacity onPress={() => onClickUserAvatar(comment.authorUserId)}>
                        <Image source={comment.avatar ? {uri: comment.avatar} : require('../../../assets/avatar_def.png')} style={styles.commentAvatar} />
                      </TouchableOpacity>
                      <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                        <Text>{comment.nickName}</Text>
                        <View>
                          <Text style={[globalStyles.fontPrimary, {lineHeight: 20}]}>{comment.content}</Text>
                        </View>
                        <View>
                          <Text style={globalStyles.fontTertiary}>{friendlyTime(comment.createdTime)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            })}
            {comment.list.length === 0 && (
              <View style={[globalStyles.containerCenter, {paddingTop: 30}]}>
                <Text style={globalStyles.fontPrimary}>还没有评论，快来抢沙发~</Text>
              </View>
            )}
          </View>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
        <View style={[globalStyles.containerRow, {padding: globalStyleVariables.MODULE_SPACE}]}>
          <TextInput
            value={modalComment}
            onChangeText={setModalComment}
            style={styles.commentInput}
            placeholder="评论一下吧"
            ref={commentInputRef}
            returnKeyType="send"
            onSubmitEditing={sendModelComment}
          />
          <TouchableOpacity activeOpacity={0.8} style={{}} onPress={sendModelComment}>
            <Text style={[globalStyles.fontPrimary]}>发送</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popup>
  );
});

export default memo(CommentModal);

const styles = StyleSheet.create({
  commentModel: {},
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentInput: {
    height: 40,
    margin: 0,
    padding: 0,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    flex: 1,
    backgroundColor: '#0000000D',
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
});
