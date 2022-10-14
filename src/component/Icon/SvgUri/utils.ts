export interface NodeAttribute {
  nodeName: string;
  nodeValue: string;
}

export const camelCase = (value: string) => value.replace(/-([a-z])/g, g => g[1].toUpperCase());

export const camelCaseNodeName = ({nodeName, nodeValue}: NodeAttribute) => ({nodeName: camelCase(nodeName), nodeValue});

export const removePixelsFromNodeValue = ({nodeName, nodeValue}: NodeAttribute) => ({nodeName, nodeValue: nodeValue.replace('px', '')});

export const transformStyle = (nodeName: string, nodeValue: string, fillProp: string) => {
  if (nodeName === 'style') {
    return nodeValue.split(';').reduce((acc, attribute) => {
      const [property, value] = attribute.split(':');
      if (property == '') {
        return acc;
      } else {
        return {...acc, [camelCase(property)]: fillProp && property === 'fill' ? fillProp : value};
      }
    }, {});
  }
  return null;
};

export const getEnabledAttributes =
  (enabledAttributes: string[]) =>
  ({nodeName}: NodeAttribute) =>
    enabledAttributes.includes(nodeName);
