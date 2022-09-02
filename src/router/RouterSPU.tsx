// import React from 'react';
// import {commonScreenOptions, Stack} from './config';
// import SPUEdit from '../screen/spu/SPUEdit';
// import SPUList from '../screen/spu/SPUList';
// import SPUDetail from '../screen/spu/SPUDetail';
// const RouterSPU = (
//   <>
//     <Stack.Screen name="EditSPU" component={SPUEdit} options={commonScreenOptions} />
//     <Stack.Screen name="AddSPU" component={SPUEdit} options={commonScreenOptions} />
//     <Stack.Screen name="SPUList" component={SPUList} options={commonScreenOptions} />
//     <Stack.Screen name="SPUDetail" component={SPUDetail} options={commonScreenOptions} />
//   </>
// );

// export default RouterSPU;

import React from 'react';
import {View, Text} from 'react-native';

const Test: React.FC = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Test</Text>
    </View>
  );
};
export default Test;
