import React, {useState} from 'react';
// import {View, Text, StyleSheet} from 'react-native';
import Header from './Header';
import PullToRefresh from './PullToRefresh';

interface RefreshProps {
  children: JSX.Element;
}

const Refresh: React.FC<RefreshProps> = props => {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }

  return (
    <PullToRefresh
      HeaderComponent={Header}
      headerHeight={50}
      refreshTriggerHeight={50}
      refreshingHoldHeight={50}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      style={{flex: 1, backgroundColor: '#fff', width: '100%'}}>
      {props.children}
    </PullToRefresh>
  );
};

export default Refresh;
