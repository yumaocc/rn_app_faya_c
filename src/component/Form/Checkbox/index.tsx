import CheckBoxComponent, {CheckboxProps} from './Checkbox';
import Group, {GroupProps} from './Group';
type Checkbox = React.FC<CheckboxProps> & {Group?: React.FC<GroupProps>};
const Component: Checkbox = CheckBoxComponent;
Component.Group = Group;

export default Component;
