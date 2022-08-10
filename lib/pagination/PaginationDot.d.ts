import React, { PureComponent } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import Carousel from '../carousel/Carousel';
declare type PaginationDotProps = {
    inactiveOpacity: number;
    inactiveScale: number;
    active?: boolean;
    activeOpacity: number;
    carouselRef: React.RefObject<Carousel<any>>;
    color: string;
    containerStyle: StyleProp<ViewStyle>;
    inactiveColor: string;
    inactiveStyle: StyleProp<ViewStyle>;
    index?: number;
    style: StyleProp<ViewStyle>;
    tappable?: boolean;
    animatedDuration: number;
    animatedFriction: number;
    animatedTension: number;
    delayPressInDot: number;
};
declare type PaginationDotState = {
    animColor: Animated.Value;
    animOpacity: Animated.Value;
    animTransform: Animated.Value;
};
export default class PaginationDot extends PureComponent<PaginationDotProps, PaginationDotState> {
    constructor(props: PaginationDotProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: PaginationDotProps): void;
    _animate(toValue?: number): void;
    get _shouldAnimateColor(): string;
    render(): JSX.Element;
}
export {};
