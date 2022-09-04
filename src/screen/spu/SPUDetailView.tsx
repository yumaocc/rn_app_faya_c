import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface SPUDetailViewProps {
  title?: string;
}

const SPUDetailView: React.FC<SPUDetailViewProps> = props => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};
SPUDetailView.defaultProps = {
  title: 'SPUDetailView',
};
export default SPUDetailView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
