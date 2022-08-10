import React, { PureComponent } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Carousel from '../carousel/Carousel';
declare type PaginationAllProps = {
    activeDotIndex: number;
    dotsLength: number;
    activeOpacity?: number;
    carouselRef: React.RefObject<Carousel<any>>;
    containerStyle: StyleProp<ViewStyle>;
    dotColor: string;
    dotContainerStyle: StyleProp<ViewStyle>;
    dotElement: JSX.Element;
    dotStyle: StyleProp<ViewStyle>;
    inactiveDotColor: string;
    inactiveDotElement: JSX.Element;
    inactiveDotOpacity: number;
    inactiveDotScale: number;
    inactiveDotStyle: StyleProp<ViewStyle>;
    renderDots: (activeDotIndex: number, dotsLength: number, pagination: Pagination) => JSX.Element;
    tappableDots: boolean;
    vertical: boolean;
    accessibilityLabel: string;
    animatedDuration: number;
    animatedFriction: number;
    animatedTension: number;
    delayPressInDot: number;
};
declare type PaginationProps = Omit<PaginationAllProps, keyof typeof Pagination['defaultProps']> & Partial<Pick<PaginationAllProps, keyof typeof Pagination['defaultProps']>>;
export default class Pagination extends PureComponent<PaginationProps> {
    static defaultProps: {
        readonly inactiveDotOpacity: 0.5;
        readonly inactiveDotScale: 0.5;
        readonly tappableDots: false;
        readonly vertical: false;
        readonly animatedDuration: 250;
        readonly animatedFriction: 4;
        readonly animatedTension: 50;
        readonly delayPressInDot: 0;
    };
    constructor(props: PaginationAllProps);
    _needsRTLAdaptations(): boolean;
    get _activeDotIndex(): number;
    get dots(): JSX.Element | React.FunctionComponentElement<any>[];
    render(): false | JSX.Element;
}
export {};
