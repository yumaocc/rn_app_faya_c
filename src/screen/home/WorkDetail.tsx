import React from 'react';
import {View, Text} from 'react-native';
import {useParams} from '../../helper/hooks';

const WorkDetail: React.FC = () => {
  const {id, videoUrl} = useParams<{id: string; videoUrl: string}>();
  // const workDet
  console.log(id, videoUrl);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>WorkDetail</Text>
    </View>
  );
};
export default WorkDetail;
