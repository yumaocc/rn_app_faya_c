import React, {useMemo, useRef, useState} from 'react';
import Video from 'react-native-video';
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  ImageBackground,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
  Animated,
  SafeAreaView,
  Easing,
  Image,
  View,
  Text,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StylePropView} from '../../models';

interface VideoPlayerProps {
  toggleResizeModeOnFullscreen?: boolean;
  controlAnimationTiming?: number;
  doubleTapTime?: number;
  playInBackground?: boolean;
  playWhenInactive?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'none';
  isFullscreen?: boolean;
  showOnStart?: boolean;
  repeat?: boolean;
  muted?: boolean;
  volume?: number;
  title?: string;
  rate?: number;
  source: ImageSourcePropType;
  thumbnail?: ImageSourcePropType;
  controlTimeout?: number;
  scrubbing?: number;
  tapAnywhereToPause?: boolean;
  videoStyle?: StylePropView;
  style?: StylePropView;
}

const VideoPlayer: React.FC<VideoPlayerProps> = props => {
  // Video
  const [resizeMode, setResizeMode] = useState(props.resizeMode);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(props.muted);
  const [volume, setVolume] = useState(props.volume);
  const [rate, setRate] = useState(props.rate);
  const [thumbnail, setThumbnail] = useState(props.thumbnail);

  // Controls
  const [isFullscreen, setIsFullscreen] = useState(props.isFullscreen);
  const [showTimeRemaining, setShowTimeRemaining] = useState(true);
  const [volumeTrackWidth, setVolumeTrackWidth] = useState(0);
  const [volumeFillWidth, setVolumeFillWidth] = useState(0);
  const [seekerFillWidth, setSeekerFillWidth] = useState(0);
  const [showControls, setShowControls] = useState(props.showOnStart);
  const [volumePosition, setVolumePosition] = useState(0);
  const [seekerPosition, setSeekerPosition] = useState(0);
  const [volumeOffset, setVolumeOffset] = useState(0);
  const [seekerOffset, setSeekerOffset] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [originallyPaused, setOriginallyPaused] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState(true);
  const [source, setSource] = useState(props.source);
  const [title, setTitle] = useState(props.title);

  function onError(e: any) {
    console.log(e);
  }
  function onBack(e: any) {
    console.log(e);
  }
  function onEnd(e: any) {
    console.log(e);
  }
  function onScreenTouch(e: any) {
    console.log(e);
  }
  function onEnterFullscreen(e: any) {
    console.log(e);
  }
  function onExitFullscreen(e: any) {
    console.log(e);
  }
  function onShowControls(e: any) {
    console.log(e);
  }
  function onHideControls(e: any) {
    console.log(e);
  }
  function onLoadStart(e: any) {
    // let state = this.state;
    //   state.loading = true;
    //   this.loadAnimation();
    //   this.setState(state);
    setLoading(true);
  }
  function onProgress(e: any) {
    console.log(e);
  }
  function onSeek(e: any) {
    console.log(e);
  }
  function onLoad(e: any) {
    console.log(e);
  }
  function onPause(e: any) {
    console.log(e);
  }
  function onPlay(e: any) {
    console.log(e);
  }

  function toggleFullscreen(e: any) {
    console.log(e);
  }
  function togglePlayPause(e: any) {
    console.log(e);
  }
  function toggleControls(e: any) {
    console.log(e);
  }
  function toggleTimer(e: any) {
    console.log(e);
  }

  const [controlTimeoutDelay, setControlTimeoutDelay] = useState(props.controlTimeout || 15000);
  const [volumePanResponder, setVolumePanResponder] = useState<PanResponder>(null);
  const [seekPanResponder, setSeekPanResponder] = useState<PanResponder>(null);
  const [controlTimeout, setControlTimeout] = useState<number>(null);
  const [tapActionTimeout, setTapActionTimeout] = useState<number>(null);
  const [volumeWidth, setVolumeWidth] = useState(150);
  const [iconOffset, setIconOffset] = useState(0);
  const [seekerWidth, setSeekerWidth] = useState(0);
  const [ref, setRef] = useState<Video>(null);
  const [scrubbingTimeStep, setScrubbingTimeStep] = useState(props.scrubbing || 0);
  const [tapAnywhereToPause, setTapAnywhereToPause] = useState(props.tapAnywhereToPause);

  /* todo:
this.animations = {
      bottomControl: {
        marginBottom: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      topControl: {
        marginTop: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      video: {
        opacity: new Animated.Value(1),
      },
      loader: {
        rotate: new Animated.Value(0),
        MAX_VALUE: 360,
      },
    };
 */

  // showOnStart
  const initialValue = props.showOnStart ? 1 : 0;
  const anim_bottomCrl_marginBottom = useRef(new Animated.Value(0)).current;
  const anim_bottomCrl_opacity = useRef(new Animated.Value(initialValue)).current;
  const anim_topCrl_marginTop = useRef(new Animated.Value(0)).current;
  const anim_topCrl_opacity = useRef(new Animated.Value(initialValue)).current;
  const anim_video_opacity = useRef(new Animated.Value(1)).current;
  const anim_loader_rotate = useRef(new Animated.Value(0)).current;
  const anim_loader_MAX_VALUE = useMemo(() => 360);

  const this_styles = {
    videoStyle: props.videoStyle || {},
    containerStyle: props.style || {},
  };

  return <View style={styles.container}>{/* <Text>{title}</Text> */}</View>;
};
VideoPlayer.defaultProps = {
  toggleResizeModeOnFullscreen: true,
  controlAnimationTiming: 500,
  doubleTapTime: 130,
  playInBackground: false,
  playWhenInactive: false,
  resizeMode: 'contain',
  isFullscreen: false,
  showOnStart: true,
  repeat: false,
  muted: false,
  volume: 1,
  title: '',
  rate: 1,
};
export default VideoPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
