/**
 * custom header component for pull to refresh
 */

import * as React from 'react';
import {Text, Animated, ViewStyle, TextStyle} from 'react-native';

import {PullToRefreshHeaderProps} from './PullToRefresh';

const {Component} = React;

const headerStyle = {
  con: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    // fontSize: 18,
  } as TextStyle,
};

interface ClassHeaderState {
  pullDistance: number;
  percent: number;
}

export default class Header extends Component<PullToRefreshHeaderProps, ClassHeaderState> {
  constructor(props: PullToRefreshHeaderProps) {
    super(props);
    this.state = {
      pullDistance: props.pullDistance,
      percent: props.percent,
    };
  }

  setProgress({pullDistance, percent}: {pullDistance: number; percent: number}) {
    this.setState({
      pullDistance,
      percent,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<PullToRefreshHeaderProps>) {
    this.setState({
      pullDistance: nextProps.pullDistance,
      percent: nextProps.percent,
    });
  }

  render() {
    const {percentAnimatedValue, refreshing} = this.props;
    const {percent: statePercent} = this.state;
    // console.log('header props 2222 ', statePercent, percent, refreshing);
    let text = '下拉刷新';
    if (statePercent >= 1) {
      if (refreshing) {
        text = '正在刷新';
      } else {
        text = '释放以刷新';
      }
    }
    return (
      <Animated.View style={[headerStyle.con, {opacity: percentAnimatedValue}]}>
        <Text style={headerStyle.title}>{text}</Text>
      </Animated.View>
    );
  }
}
