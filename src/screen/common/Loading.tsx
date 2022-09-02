import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';

const Loading: React.FC = () => {
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    commonDispatcher.initApp();
  }, [commonDispatcher]);

  return (
    <View style={{paddingTop: 300, alignItems: 'center'}}>
      <Text style={{textAlign: 'center'}}>faya is loading...</Text>
    </View>
  );
};
export default Loading;
