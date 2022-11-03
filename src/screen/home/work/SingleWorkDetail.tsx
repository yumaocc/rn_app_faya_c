import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {FakeNavigation, WorkDetailF} from '../../../models';
import * as api from '../../../apis';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import WorkPage from './WorkPage';
import {NavigationBar} from '../../../component';
import CommentModal, {CommentModalRef} from './CommentModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {useNavigation} from '@react-navigation/native';
import {getShareWorkLink} from '../../../helper/order';
import WorkShareModal from '../../mine/agent/WorkShareModal';
import MyStatusBar from '../../../component/MyStatusBar';
import {getSPUNavigateParam} from '../../../helper/spu';

const SingleWorkDetail: React.FC = () => {
  const [workDetail, setWorkDetail] = useState<WorkDetailF>(null);
  const [showShareWork, setShowShareWork] = useState(false);
  const [workSharePosterUrl, setWorkSharePosterUrl] = useState('');
  const [workShareLink, setWorkShareLink] = useState('');

  const userId = useSelector((state: RootState) => state.user.myDetail?.userId);

  const {id} = useParams<{id: string}>();
  const commentModalRef = useRef<CommentModalRef>(null);

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    api.work
      .getWorkDetail(id)
      .then(res => {
        setWorkDetail(res);
      })
      .catch(commonDispatcher.error);
  }, [commonDispatcher.error, id]);

  const openSPU = useCallback(
    (id: number, mainId: string) => {
      navigation.navigate(getSPUNavigateParam(id, mainId));
    },
    [navigation],
  );

  function openCommentModal(mainId: string, autoFocus = false) {
    commentModalRef.current?.openComment(mainId, autoFocus);
  }

  function handleShareWork(mainId: string) {
    setWorkShareLink(getShareWorkLink(mainId, userId));

    api.spu
      .getSharePoster(mainId, 1)
      .then(res => {
        if (res) {
          setWorkSharePosterUrl(res);
          setShowShareWork(true);
        }
      })
      .catch(commonDispatcher.error);
  }

  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      <NavigationBar color="#fff" style={styles.nav} />
      {workDetail && (
        <WorkPage
          width={width}
          height={height}
          coverImage={workDetail.coverImage}
          videoUrl={workDetail?.videoUrl}
          mainId={workDetail.mainId}
          paused={false}
          shouldLoad={true}
          onShowSPU={spuId => openSPU(spuId, workDetail.mainId)}
          onShowShare={handleShareWork}
          onShowComment={openCommentModal}
        />
      )}
      {/* {showSPU && (
        <Popup visible={true} onClose={() => setShowSPU(false)} style={[{height: height * 0.7}]} useNativeDrive={false}>
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}} bounces={false}>
              <SPUDetailView currentSelect={currentSKU} spu={currentSPU} isPackage={currentSKUIsPackage} onChangeSelect={handleChangeSKU} />
            </ScrollView>
            <BuyBar spu={currentSPU} sku={currentSKU} onBuy={handleBuy} onCollect={handleCollect} onAddToShopWindow={handleJoinShowCase} onShare={openShareModal} />
          </View>
        </Popup>
      )} */}

      <CommentModal ref={commentModalRef} />
      {/* {showShare && <SPUShareModal visible={true} poster={posterUrl} link={shareLink} onClose={() => setShowShare(false)} />} */}
      {showShareWork && <WorkShareModal visible={true} poster={workSharePosterUrl} link={workShareLink} onClose={() => setShowShareWork(false)} />}
    </View>
  );
};

export default SingleWorkDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
});
