import React, {useMemo} from 'react';
import {globalStyleVariables} from '../../constants/styles';
import {StylePropView} from '../../models';
import SvgUri from './SvgUri';
import {icons} from './icons';

export type IconName = keyof typeof icons;
interface IconProps {
  name?: IconName;
  size?: number;
  color?: string;
  style?: StylePropView;
}

const Icon: React.FC<IconProps> = props => {
  const {name} = props;
  const svgData = useMemo(() => icons[name], [name]);
  if (!svgData) {
    return null;
  }
  return <SvgUri style={props.style} width={props.size} height={props.size} svgXmlData={svgData} fill={props.color} />;
};
Icon.defaultProps = {
  size: 24,
  color: globalStyleVariables.COLOR_CASH,
  style: {},
};
export default Icon;
