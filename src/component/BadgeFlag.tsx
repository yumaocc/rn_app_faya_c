import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface BadgeFlagProps {
  label?: string;
  corner?: 'topLeft' | 'topRight';
}

const BadgeFlag: React.FC<BadgeFlagProps> = props => {
  const {label} = props;
  if (!label) {
    return null;
  }
  const transformStyle = styles[props.corner] || styles.topLeft;
  return (
    <View style={[styles.container, transformStyle]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};
BadgeFlag.defaultProps = {
  label: '',
  corner: 'topLeft',
};
export default BadgeFlag;

const width = 80;
const height = 14;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
    backgroundColor: '#ff646d',
    top: -height / 2 + 15,
  },
  topLeft: {
    left: -width / 2 + 15,
    transform: [{rotate: '-45deg'}],
  },
  topRight: {
    right: -width / 2 + 15,
    transform: [{rotate: '45deg'}],
  },

  label: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
