import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';
import {Toast} from '@ant-design/react-native';
import {ERROR_SHOW_TIME} from '../constants';

const GlobalToast: React.FC = () => {
  const message = useSelector((state: RootState) => state.common.message);
  const messageType = useSelector((state: RootState) => state.common.messageType);
  useEffect(() => {
    if (!message) {
      return;
    }
    const duration = ERROR_SHOW_TIME / 1000;
    const body = {
      content: message,
      duration,
      mask: false,
    };
    switch (messageType) {
      case 'success':
        Toast.success(body);
        break;
      case 'error':
        Toast.fail(body);
        break;
      default:
        Toast.info(body);
        break;
    }
  }, [message, messageType]);
  return null;
};
export default GlobalToast;
