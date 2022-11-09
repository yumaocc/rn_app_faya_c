import React from 'react';
import {View, StyleSheet} from 'react-native';
import MyStatusBar from '../../../component/MyStatusBar';
import {useParams} from '../../../helper/hooks';

const WorkStream: React.FC = () => {
  const {index, type} = useParams<{index: number; type: 'home' | 'mine' | 'user'}>();
  return (
    <View style={styles.container}>
      <MyStatusBar />
    </View>
  );
};

export default WorkStream;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
