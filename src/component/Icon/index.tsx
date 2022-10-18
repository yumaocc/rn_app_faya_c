import React, {useMemo} from 'react';
import {globalStyleVariables} from '../../constants/styles';
import {StylePropView} from '../../models';
import SvgUri from './SvgUri';
import {icons} from './icons';

export type IconName = keyof typeof icons;
interface IconProps {
  name?: IconName;
  size?: number; // size会统一图标的宽和高，如果是宽高不一致的图标，可以使用width和height来设置
  width?: number;
  height?: number;
  color?: string;
  style?: StylePropView;
}

const Icon: React.FC<IconProps> = props => {
  const {name} = props;
  const svgData = useMemo(() => icons[name], [name]);
  if (!svgData) {
    return null;
  }
  return <SvgUri style={props.style} width={props.width || props.size} height={props.height || props.size} svgXmlData={svgData} fill={props.color} />;
};
Icon.defaultProps = {
  size: 24,
  color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  style: {},
};
export default Icon;
