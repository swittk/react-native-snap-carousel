// Parallax effect inspired by https://github.com/oblador/react-native-parallax/

import React, { Component } from 'react';
import { View, ImageProps, Image, Animated, Easing, ActivityIndicator, findNodeHandle, StyleProp, ViewStyle, FlatList, ScrollView, ImageStyle, NativeSyntheticEvent, ImageLoadEventData, ImageErrorEventData } from 'react-native';
import PropTypes from 'prop-types';
import styles from './ParallaxImage.style';
import type Carousel from '../carousel/Carousel';

type ParallaxImageAllProps = {
    carouselRef: ScrollView | FlatList, // passed from <Carousel />
    itemHeight: number, // passed from <Carousel />
    itemWidth: number, // passed from <Carousel />
    scrollPosition: Animated.Value, // passed from <Carousel />
    sliderHeight: number, // passed from <Carousel />
    sliderWidth: number, // passed from <Carousel />
    vertical: boolean, // passed from <Carousel />
    containerStyle: StyleProp<ViewStyle>,
    /**
     * On screen dimensions of the image
     */
    dimensions: { width: number, height: number },
    /**
     * Duration of fade in when object is loaded. Default of 500
     */
    fadeDuration: number,
    /**
     * Speed of parallax effect. A higher value appears more 'zoomed in'
     */
    parallaxFactor: number,
    /**
     * Whether to display a loading spinner
     */
    showSpinner: boolean,
    /**
     * Color of the loading spinner if displayed
     */
    spinnerColor: string,
    AnimatedImageComponent: typeof Animated.Image | Animated.AnimatedComponent<typeof Image>
} & ImageProps;

type ParallaxImageProps = Omit<ParallaxImageAllProps, keyof typeof ParallaxImage['defaultProps']> & Partial<Pick<ParallaxImageAllProps, keyof typeof ParallaxImage['defaultProps']>>;

type ParallaxImageState = {
    /**
     *  1 -> loading; 2 -> loaded // 3 -> transition finished; 4 -> error
     */
    status: 1 | 2 | 3 | 4,
    animOpacity: Animated.Value,
    offset: number,
    width: number,
    height: number
}

export default class ParallaxImage extends Component<ParallaxImageProps, ParallaxImageState> {
    _container: View | null = null;
    _mounted = false;

    static defaultProps = {
        containerStyle: {},
        fadeDuration: 500,
        parallaxFactor: 0.3,
        showSpinner: true,
        spinnerColor: 'rgba(0, 0, 0, 0.4)',
        AnimatedImageComponent: Animated.Image
    }

    constructor(props: ParallaxImageProps) {
        super(props);
        this.state = {
            offset: 0,
            width: 0,
            height: 0,
            status: 1, // 1 -> loading; 2 -> loaded // 3 -> transition finished; 4 -> error
            animOpacity: new Animated.Value(0)
        };
        this._onLoad = this._onLoad.bind(this);
        this._onError = this._onError.bind(this);
        this._measureLayout = this._measureLayout.bind(this);
    }

    setNativeProps(nativeProps: object) {
        this._container!.setNativeProps(nativeProps);
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => {
            this._measureLayout();
        }, 0);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _measureLayout() {
        if (this._container) {
            const {
                dimensions,
                vertical,
                carouselRef,
                sliderWidth,
                sliderHeight,
                itemWidth,
                itemHeight
            } = this.props;

            if (carouselRef) {
                this._container.measureLayout(
                    findNodeHandle(carouselRef)!,
                    (x, y, width, height) => {
                        const offset = vertical ?
                            y - ((sliderHeight - itemHeight) / 2) :
                            x - ((sliderWidth - itemWidth) / 2);

                        this.setState({
                            offset: offset,
                            width: dimensions && dimensions.width ?
                                dimensions.width :
                                Math.ceil(width),
                            height: dimensions && dimensions.height ?
                                dimensions.height :
                                Math.ceil(height)
                        });
                    },
                    () => {
                        // lol do nothing when fail
                    }
                );
            }
        }
    }

    _onLoad(event: NativeSyntheticEvent<ImageLoadEventData>) {
        const { animOpacity } = this.state;
        const { fadeDuration, onLoad } = this.props;

        if (!this._mounted) {
            return;
        }

        this.setState({ status: 2 });

        if (onLoad) {
            onLoad(event);
        }

        Animated.timing(animOpacity, {
            toValue: 1,
            duration: fadeDuration,
            easing: Easing.out(Easing.quad),
            isInteraction: false,
            useNativeDriver: true
        }).start(() => {
            this.setState({ status: 3 });
        });
    }

    // If arg is missing from method signature, it just won't be called
    _onError(event: NativeSyntheticEvent<ImageErrorEventData>) {
        const { onError } = this.props;

        this.setState({ status: 4 });

        if (onError) {
            onError(event);
        }
    }

    get image() {
        const { status, animOpacity, offset, width, height } = this.state;
        const {
            scrollPosition,
            dimensions,
            vertical,
            sliderWidth,
            sliderHeight,
            parallaxFactor,
            style,
            AnimatedImageComponent,
            ...other
        } = this.props as ParallaxImageAllProps;

        const parallaxPadding = (vertical ? height : width) * parallaxFactor;
        const requiredStyles = { position: 'relative' } as ImageStyle;
        const dynamicStyles = {
            width: vertical ? width : width + parallaxPadding * 2,
            height: vertical ? height + parallaxPadding * 2 : height,
            opacity: animOpacity,
            transform: scrollPosition ? [
                {
                    translateX: !vertical ? scrollPosition.interpolate({
                        inputRange: [offset - sliderWidth, offset + sliderWidth],
                        outputRange: [-parallaxPadding, parallaxPadding],
                        extrapolate: 'clamp'
                    }) : 0
                },
                {
                    translateY: vertical ? scrollPosition.interpolate({
                        inputRange: [offset - sliderHeight, offset + sliderHeight],
                        outputRange: [-parallaxPadding, parallaxPadding],
                        extrapolate: 'clamp'
                    }) : 0
                }
            ] : []
        };

        return (
            <AnimatedImageComponent
                {...other}
                style={[styles.image, style, requiredStyles, dynamicStyles]}
                onLoad={this._onLoad}
                onError={status !== 3 ? this._onError : undefined} // prevent infinite-loop bug
            />
        );
    }

    get spinner() {
        const { status } = this.state;
        const { showSpinner, spinnerColor } = this.props;

        return status === 1 && showSpinner ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator
                    size={'small'}
                    color={spinnerColor}
                    animating={true}
                />
            </View>
        ) : false;
    }

    render() {
        const { containerStyle } = this.props;

        return (
            <View
                ref={(c) => { this._container = c; }}
                pointerEvents={'none'}
                style={[containerStyle, styles.container]}
                onLayout={this._measureLayout}
            >
                {this.image}
                {this.spinner}
            </View>
        );
    }
}
