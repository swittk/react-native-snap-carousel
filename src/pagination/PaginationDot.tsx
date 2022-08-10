import React, { PureComponent } from 'react';
import { View, Animated, Easing, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Pagination.style';
import Carousel from '../carousel/Carousel';

type PaginationDotProps = {
    inactiveOpacity: number,
    inactiveScale: number,
    active?: boolean,
    activeOpacity: number,
    carouselRef: React.RefObject<Carousel<any>>,
    color: string,
    containerStyle: StyleProp<ViewStyle>,
    inactiveColor: string,
    inactiveStyle: StyleProp<ViewStyle>,
    index?: number,
    style: StyleProp<ViewStyle>,
    tappable?: boolean,
    animatedDuration: number,
    animatedFriction: number,
    animatedTension: number,
    delayPressInDot: number
}
type PaginationDotState = {
    animColor: Animated.Value,
    animOpacity: Animated.Value,
    animTransform: Animated.Value
}

export default class PaginationDot extends PureComponent<PaginationDotProps, PaginationDotState> {

    constructor(props: PaginationDotProps) {
        super(props);
        this.state = {
            animColor: new Animated.Value(0),
            animOpacity: new Animated.Value(0),
            animTransform: new Animated.Value(0)
        };
    }

    componentDidMount() {
        if (this.props.active) {
            this._animate(1);
        }
    }

    componentDidUpdate(prevProps: PaginationDotProps) {
        if (prevProps.active !== this.props.active) {
            this._animate(this.props.active ? 1 : 0);
        }
    }

    _animate(toValue = 0) {
        const { animColor, animOpacity, animTransform } = this.state;
        const { animatedDuration, animatedFriction, animatedTension } = this.props

        const commonProperties = {
            toValue,
            duration: animatedDuration,
            isInteraction: false,
            useNativeDriver: !this._shouldAnimateColor
        };

        let animations = [
            Animated.timing(animOpacity, {
                easing: Easing.linear,
                ...commonProperties
            }),
            Animated.spring(animTransform, {
                friction: animatedFriction,
                tension: animatedTension,
                ...commonProperties
            })
        ];

        if (this._shouldAnimateColor) {
            animations.push(Animated.timing(animColor, {
                easing: Easing.linear,
                ...commonProperties
            }));
        }

        Animated.parallel(animations).start();
    }

    get _shouldAnimateColor() {
        const { color, inactiveColor } = this.props;
        return color && inactiveColor;
    }

    render() {
        const { animColor, animOpacity, animTransform } = this.state;
        const {
            active,
            activeOpacity,
            carouselRef,
            color,
            containerStyle,
            inactiveColor,
            inactiveStyle,
            inactiveOpacity,
            inactiveScale,
            index,
            style,
            tappable,
            delayPressInDot
        } = this.props;

        const animatedStyle = {
            opacity: animOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [inactiveOpacity, 1]
            }),
            transform: [{
                scale: animTransform.interpolate({
                    inputRange: [0, 1],
                    outputRange: [inactiveScale, 1]
                })
            }]
        };
        const animatedColor = this._shouldAnimateColor ? {
            backgroundColor: animColor.interpolate({
                inputRange: [0, 1],
                outputRange: [inactiveColor, color]
            })
        } : {};

        const dotContainerStyle = [
            styles.sliderPaginationDotContainer,
            containerStyle || {}
        ];

        const dotStyle = [
            styles.sliderPaginationDot,
            style || {},
            (!active && inactiveStyle) || {},
            animatedStyle,
            animatedColor
        ];

        const onPress = tappable ? () => {
            try {
                const currentRef = carouselRef.current;
                currentRef!._snapToItem(currentRef!._getPositionIndex(index || 0));
            } catch (error) {
                console.warn(
                    'react-native-snap-carousel | Pagination: ' +
                    '`carouselRef` has to be a Carousel ref.\n' + error
                );
            }
        } : undefined;

        return (
            <TouchableOpacity
                accessible={false}
                style={dotContainerStyle}
                activeOpacity={tappable ? activeOpacity : 1}
                onPress={onPress}
                delayPressIn={delayPressInDot}
            >
                <Animated.View style={dotStyle} />
            </TouchableOpacity>
        );
    }
}
