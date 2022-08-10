import { Component } from 'react';
import { View, ImageProps, Image, Animated, StyleProp, ViewStyle, FlatList, ScrollView, NativeSyntheticEvent, ImageLoadEventData, ImageErrorEventData } from 'react-native';
declare type ParallaxImageAllProps = {
    carouselRef: ScrollView | FlatList;
    itemHeight: number;
    itemWidth: number;
    scrollPosition: Animated.Value;
    sliderHeight: number;
    sliderWidth: number;
    vertical: boolean;
    containerStyle: StyleProp<ViewStyle>;
    /**
     * On screen dimensions of the image
     */
    dimensions: {
        width: number;
        height: number;
    };
    /**
     * Duration of fade in when object is loaded. Default of 500
     */
    fadeDuration: number;
    /**
     * Speed of parallax effect. A higher value appears more 'zoomed in'
     */
    parallaxFactor: number;
    /**
     * Whether to display a loading spinner
     */
    showSpinner: boolean;
    /**
     * Color of the loading spinner if displayed
     */
    spinnerColor: string;
    AnimatedImageComponent: typeof Animated.Image | Animated.AnimatedComponent<typeof Image>;
} & ImageProps;
declare type ParallaxImageProps = Omit<ParallaxImageAllProps, keyof typeof ParallaxImage['defaultProps']> & Partial<Pick<ParallaxImageAllProps, keyof typeof ParallaxImage['defaultProps']>>;
declare type ParallaxImageState = {
    /**
     *  1 -> loading; 2 -> loaded // 3 -> transition finished; 4 -> error
     */
    status: 1 | 2 | 3 | 4;
    animOpacity: Animated.Value;
    offset: number;
    width: number;
    height: number;
};
export default class ParallaxImage extends Component<ParallaxImageProps, ParallaxImageState> {
    _container: View | null;
    _mounted: boolean;
    static defaultProps: {
        containerStyle: {};
        fadeDuration: number;
        parallaxFactor: number;
        showSpinner: boolean;
        spinnerColor: string;
        AnimatedImageComponent: Animated.AnimatedComponent<typeof Image>;
    };
    constructor(props: ParallaxImageProps);
    setNativeProps(nativeProps: object): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    _measureLayout(): void;
    _onLoad(event: NativeSyntheticEvent<ImageLoadEventData>): void;
    _onError(event: NativeSyntheticEvent<ImageErrorEventData>): void;
    get image(): JSX.Element;
    get spinner(): false | JSX.Element;
    render(): JSX.Element;
}
export {};
