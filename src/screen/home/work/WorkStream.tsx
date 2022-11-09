import {Carousel} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {NavigationBar} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {globalStyles} from '../../../constants/styles';
import {useParams} from '../../../helper/hooks';
import {WorkF} from '../../../models';

const WorkStream: React.FC = () => {
  const {index, type, work} = useParams<{index: number; type: 'home' | 'mine' | 'user'; work: WorkF}>();
  const [works, setWorks] = useState<WorkF[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setWorks([work]);
    setIsReady(true);
  }, [work]);

  useEffect(() => {
    if (isReady) {
      const fakeWork: WorkF = {
        id: '1',
        content: 'test',
      };
      setTimeout(() => {
        setWorks(works => [fakeWork, ...works]);
      }, 1000);
    }
  }, [isReady]);

  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="light-content" />
      <NavigationBar canBack={true} style={styles.nav} color="#fff" />
      <View style={{flex: 1}}>
        <Carousel vertical dots={false} style={{width: '100%', height: '100%'}}>
          {works.map((work, index) => {
            return (
              <View style={[globalStyles.containerCenter, styles.workItem]} key={index}>
                <Text style={[globalStyles.fontPrimary, {color: '#fff'}]}>{work.content}</Text>
              </View>
            );
          })}
        </Carousel>
      </View>
    </View>
  );
};

export default WorkStream;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  nav: {
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  workItem: {
    // flex: 1,
    width: '100%',
    height: '100%',
  },
});
