import React from 'react';
import {View, Text} from 'react-native';
import {useParams} from '../../helper/hooks';

const WorkDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  // const workDet
  console.log(id);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>WorkDetail</Text>
    </View>
  );
};
export default WorkDetail;
