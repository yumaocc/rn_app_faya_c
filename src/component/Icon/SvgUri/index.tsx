import React, {useEffect} from 'react';
import {View} from 'react-native';
import xmldom from 'xmldom';
import Svg, {Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Use, Defs, Stop} from 'react-native-svg';

import * as utils from './utils';
import {StylePropView} from '../../../models';

const ACEPTED_SVG_ELEMENTS = ['svg', 'g', 'circle', 'path', 'rect', 'linearGradient', 'radialGradient', 'stop', 'ellipse', 'polygon'];

// Attributes from SVG elements that are mapped directly.
const SVG_ATTS = ['viewBox'];
const G_ATTS = ['id'];
const CIRCLE_ATTS = ['cx', 'cy', 'r', 'fill', 'stroke', 'strokeWidth'];
const PATH_ATTS = ['d', 'fill', 'stroke', 'strokeWidth', 'fillRule', 'clipRule'];
const RECT_ATTS = ['width', 'height', 'fill', 'stroke', 'x', 'y'];
const LINEARG_ATTS = ['id', 'x1', 'y1', 'x2', 'y2'];
const RADIALG_ATTS = ['id', 'cx', 'cy', 'r'];
const STOP_ATTS = ['offset'];
const ELLIPSE_ATTS = ['fill', 'cx', 'cy', 'rx', 'ry'];
const POLYGON_ATTS = ['points'];

let ind = 0;

interface SvgUriProps {
  svgXmlData: string;
  fill?: string;
  width?: number;
  height?: number;
  style?: StylePropView;
}

const SvgUri: React.FC<SvgUriProps> = props => {
  // let isComponentMounted = false;
  const {svgXmlData, fill, width, height} = props;

  useEffect(() => {
    // const responseXML = null;
    try {
    } catch (error) {}
  }, [svgXmlData]);

  function inspectNode(node: ChildNode) {
    let arrayElements = [];

    // Only process accepted elements
    if (!ACEPTED_SVG_ELEMENTS.includes(node.nodeName)) {
      return null;
    }
    // if have children process them.

    // Recursive function.
    if (node.childNodes && node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        let nodo = inspectNode(node.childNodes[i]);
        if (nodo != null) {
          arrayElements.push(nodo);
        }
      }
    }
    let element = createSVGElement(node, arrayElements);
    return element;
  }

  function createSVGElement(node: any, children: any) {
    let componentAtts: any = {};
    let i = ind++;
    switch (node.nodeName) {
      case 'svg':
        componentAtts = obtainComponentAtts(node, SVG_ATTS);
        if (width) {
          componentAtts.width = width;
        }
        if (height) {
          componentAtts.height = height;
        }

        return (
          <Svg key={i} {...componentAtts}>
            {children}
          </Svg>
        );
      case 'g':
        componentAtts = obtainComponentAtts(node, G_ATTS);
        return (
          <G key={i} {...componentAtts}>
            {children}
          </G>
        );
      case 'path':
        componentAtts = obtainComponentAtts(node, PATH_ATTS);
        return (
          <Path key={i} {...componentAtts}>
            {children}
          </Path>
        );
      case 'circle':
        componentAtts = obtainComponentAtts(node, CIRCLE_ATTS);
        return (
          <Circle key={i} {...componentAtts}>
            {children}
          </Circle>
        );
      case 'rect':
        componentAtts = obtainComponentAtts(node, RECT_ATTS);
        return (
          <Rect key={i} {...componentAtts}>
            {children}
          </Rect>
        );
      case 'linearGradient':
        componentAtts = obtainComponentAtts(node, LINEARG_ATTS);
        return (
          <Defs key={i}>
            <LinearGradient {...componentAtts}>{children}</LinearGradient>
          </Defs>
        );
      case 'radialGradient':
        componentAtts = obtainComponentAtts(node, RADIALG_ATTS);
        return (
          <Defs key={i}>
            <RadialGradient {...componentAtts}>{children}</RadialGradient>
          </Defs>
        );
      case 'stop':
        componentAtts = obtainComponentAtts(node, STOP_ATTS);
        return (
          <Stop key={i} {...componentAtts}>
            {children}
          </Stop>
        );
      case 'ellipse':
        componentAtts = obtainComponentAtts(node, ELLIPSE_ATTS);
        return (
          <Ellipse key={i} {...componentAtts}>
            {children}
          </Ellipse>
        );
      case 'polygon':
        componentAtts = obtainComponentAtts(node, POLYGON_ATTS);
        return (
          <Polygon key={i} {...componentAtts}>
            {children}
          </Polygon>
        );
      default:
        return null;
    }
  }

  function obtainComponentAtts({attributes}: any, enabledAttributes: any) {
    let styleAtts = {};
    Array.from(attributes).forEach(({nodeName, nodeValue}) => {
      Object.assign(styleAtts, utils.transformStyle(nodeName, nodeValue, fill));
    });

    let componentAtts = Array.from(attributes)
      .map(utils.camelCaseNodeName)
      .map(utils.removePixelsFromNodeValue)
      .filter(utils.getEnabledAttributes(enabledAttributes))
      .map(a => {
        console.log('attr', a);
        return a;
      })
      .reduce(
        (acc, {nodeName, nodeValue}) => ({
          ...acc,
          [nodeName]: fill && ['fill', 'stroke'].includes(nodeName) ? fill : nodeValue,
        }),
        {},
      );
    Object.assign(componentAtts, styleAtts);
    return componentAtts;
  }

  if (!svgXmlData) {
    return null;
  }

  let inputSVG = svgXmlData.substring(svgXmlData.indexOf('<svg '), svgXmlData.indexOf('</svg>') + 6);
  let doc = new xmldom.DOMParser().parseFromString(inputSVG);
  const child = doc.childNodes[0];
  let rootSVG = inspectNode(child);

  // const fecthSVGData = useCallback(async (uri: string) => {
  //   let responseXML = null;
  //   try {
  //     let response = await fetch(uri);
  //     responseXML = await response.text();
  //   } catch (error) {}
  //   return responseXML;
  // }, []);

  return <View style={props.style}>{rootSVG}</View>;
};

export default SvgUri;
