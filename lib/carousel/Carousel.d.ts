import React, { Component } from 'react';
import { Animated, FlatList, ScrollView, StyleProp, ViewStyle, ScrollViewProps, GestureResponderEvent, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent, FlatListProps } from 'react-native';
export declare type CarouselAllProps<T> = {
    /**
     * Array of items to loop over
     */
    data: ReadonlyArray<T>;
    /**
     * Function that takes an item from the `data` array and returns a React
     * Element. See `react-native`'s `FlatList`
     */
    renderItem: (item: {
        item: T;
        index: number;
    }, parallaxProps?: {
        carouselRef?: ScrollView | FlatList | undefined;
        itemHeight?: number | undefined;
        itemWidth?: number | undefined;
        scrollPosition?: Animated.Value | undefined;
        sliderHeight?: number | undefined;
        sliderWidth?: number | undefined;
        vertical?: boolean | undefined;
    }) => React.ReactNode;
    /**
     * Width in pixels of your slides, must be the same for all of them
     * Note: Required with horizontal carousel
     */
    itemWidth: number;
    /**
     * Height in pixels of carousel's items, must be the same for all of them
     * Note: Required with vertical carousel
     */
    itemHeight: number;
    /**
     * Width in pixels of your slider
     * Note: Required with horizontal carousel
     */
    sliderWidth: number;
    /**
     * Height in pixels of the carousel itself
     * Note: Required with vertical carousel
     */
    sliderHeight: number;
    /**
     * From slider's center, minimum slide distance to be scrolled before being set to active
     */
    activeSlideOffset: number;
    /**
     * Duration of time while component is hidden after mounting. NOTE: May cause rendering
     * issues on Android. Defaults to 0
     */
    apparitionDelay: number;
    /**
     * Trigger autoplay on mount
     */
    autoplay: boolean;
    /**
     * Delay before enabling autoplay on startup & after releasing the touch
     */
    autoplayDelay: number;
    /**
     * Delay in ms until navigating to the next item
     */
    autoplayInterval: number;
    /**
     * Defines a small margin for callbacks firing from scroll events.  Increase this value
     * if you experience missed callbacks. Defaults to 5
     */
    callbackOffsetMargin: number;
    /**
     * Since 1.5.0, the snapping effect can now be based on momentum instead of when you're
     * releasing your finger. It means that the component will wait until the ScrollView
     * isn't moving anymore to snap
     */
    enableMomentum: boolean;
    /**
     * If enabled, releasing the touch will scroll to the center of the nearest/active item
     */
    enableSnap: boolean;
    /**
     * Index of the first item to display
     */
    firstItem: number;
    /**
     * Flag to indicate whether the carousel contains `<ParallaxImage />`. Parallax data
     * will not be passed to carousel items if this is false
     */
    hasParallaxImages: boolean;
    /**
     * Changes default lock's timeout duration in ms.
     */
    lockScrollTimeoutDuration: number;
    /**
     * Prevent the user from interacting with the carousel while it is snapping. Ignored
     * if `enableMomentum` is `true`
     */
    lockScrollWhileSnapping: boolean;
    /**
     * Enable infinite loop mode. Does not work if `enableSnap` is `false`
     */
    loop: boolean;
    /**
     * Number of clones to render at the beginning and end of the list. Default
     * is 3
     */
    loopClonesPerSide: number;
    /**
     * Allow scroll independently of user interaction on carousel. `false` as default.
     */
    scrollEnabled: boolean;
    /**
     * Whether to implement a shouldComponentUpdate strategy to minimize updates
     */
    shouldOptimizeUpdates: boolean;
    /**
     * Delta x when swiping to trigger the snap
     */
    swipeThreshold: number;
    /**
     * Determines whether to use `ScrollView` instead of `FlatList`. May cause
     * rendering performance issues due to losing `FlatList`'s performance
     * optimizations
     */
    useScrollView: boolean;
    vertical: boolean;
    /**
     * Custom animation options.
     * Note that useNativeDriver will be enabled by default and that opacity's easing will always be kept linear.
     * Setting this prop to something other than null will trigger custom animations and will completely change
     * the way items are animated: rather than having their opacity and scale interpolated based the scroll value (default behavior),
     * they will now play the custom animation you provide as soon as they become active.
     * This means you cannot use props layout, scrollInterpolator or slideInterpolatedStyle in conjunction with activeAnimationOptions
     */
    activeAnimationOptions: Animated.DecayAnimationConfig | Animated.TimingAnimationConfig | Animated.SpringAnimationConfig | undefined;
    /**
     * Custom animation type: either 'decay, 'spring' or 'timing'.
     * Note that it will only be applied to the scale animation since opacity's animation type will always be set
     * to timing (no one wants the opacity to 'bounce' around)
     */
    activeAnimationType: 'timing' | 'spring' | 'decay';
    /**
     * Determine active slide's alignment relative to the carousel
     */
    activeSlideAlignment: 'center' | 'end' | 'start';
    /**
     * Optional styles for Scrollview's global wrapper
     */
    containerCustomStyle: StyleProp<ViewStyle>;
    /**
     * Optional styles for Scrollview's items container
     */
    contentContainerCustomStyle: StyleProp<ViewStyle>;
    /**
     * Value of the opacity effect applied to inactive slides
     */
    inactiveSlideOpacity: number;
    /**
     * Value of the 'scale' transform applied to inactive slides
     */
    inactiveSlideScale: number;
    /**
     * Value of the 'translate' transform applied to inactive slides. Not recommended with
     * `customAnimationOptions`
     */
    inactiveSlideShift: number;
    /**
     * Define the way items are rendered and animated.
     * Possible values are 'default', 'stack' and 'tinder'.
     * See this for more info and visual examples.
     * WARNING: setting this prop to either 'stack' or 'tinder' will activate useScrollView to prevent rendering bugs with FlatList.
     * Therefore, those layouts will probably not be suited if you have a large data set.
     */
    layout: 'default' | 'stack' | 'tinder';
    /**
     * Use to increase or decrease the default card offset in both 'stack' and 'tinder' layouts.
     */
    layoutCardOffset: number;
    /**
     * Used to define custom interpolations
     */
    scrollInterpolator: (index: number, props: Readonly<CarouselProps<T>>) => {
        inputRange: number[];
        outputRange: number[];
    };
    /**
     * Used to define custom interpolations
     */
    slideInterpolatedStyle: (index: number, animatedValue: Animated.AnimatedValue, carouselProps: CarouselProps<any>, cardOffset?: number) => StyleProp<ViewStyle>;
    /**
     * Optional style for each item's container (the one whose scale and opacity are animated)
     */
    slideStyle: StyleProp<ViewStyle>;
    /**
     * Exposed View callback; invoked on mount and layout changes
     */
    onLayout?: (event: LayoutChangeEvent) => void;
    /**
     * Exposed ScrollView callback; fired while scrolling
     */
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onBeforeSnapToItem?: (slideIndex: number) => void;
    onSnapToItem?: (slideIndex: number) => void;
    keyExtractor?: (item: T, index: number) => string;
} & ScrollViewProps & FlatListProps<T>;
export declare type CarouselProps<T> = Omit<CarouselAllProps<T>, keyof typeof Carousel['defaultProps']> & Partial<Pick<CarouselAllProps<T>, keyof typeof Carousel['defaultProps']>>;
declare type CarouselState = {
    hideCarousel: boolean;
    interpolators: (Animated.Value | Animated.AnimatedInterpolation)[];
};
export default class Carousel<T> extends Component<CarouselProps<T>, CarouselState> {
    _activeItem: number;
    _previousActiveItem: number;
    _previousFirstItem: number;
    _previousItemsLength: number;
    _mounted: boolean;
    _positions: {
        start: number;
        end: number;
    }[];
    /** store ScrollView's scroll position */
    _currentContentOffset: number;
    _canFireBeforeCallback: boolean;
    _canFireCallback: boolean;
    _scrollOffsetRef: number | null;
    /** used when momentum is enabled to prevent an issue with edges items */
    _onScrollTriggered: boolean;
    /** used to work around a FlatList bug */
    _lastScrollDate: number;
    _scrollEnabled: boolean;
    _scrollPos: Animated.Value;
    _onScrollHandler: (...args: any[]) => void;
    _ignoreNextMomentum: boolean;
    _itemToSnapTo: number;
    _scrollEndOffset: number;
    _apparitionTimeout: ReturnType<typeof setTimeout> | undefined;
    _hackSlideAnimationTimeout: ReturnType<typeof setTimeout> | undefined;
    _enableAutoplayTimeout: ReturnType<typeof setTimeout> | undefined;
    _autoplayTimeout: ReturnType<typeof setTimeout> | undefined;
    _snapNoMomentumTimeout: ReturnType<typeof setTimeout> | undefined;
    _edgeItemTimeout: ReturnType<typeof setTimeout> | undefined;
    _lockScrollTimeout: ReturnType<typeof setTimeout> | undefined;
    _autoplayInterval: ReturnType<typeof setInterval> | undefined;
    _carouselRef: ScrollView | FlatList | undefined;
    _autoplay: boolean;
    _autoplaying: boolean;
    _scrollStartOffset: number;
    _scrollStartActive: number;
    _scrollEndActive: number;
    _onLayoutInitDone: boolean;
    static defaultProps: {
        readonly activeAnimationType: "timing";
        readonly activeAnimationOptions: null;
        readonly activeSlideAlignment: "center";
        readonly activeSlideOffset: 20;
        readonly apparitionDelay: 0;
        readonly autoplay: false;
        readonly autoplayDelay: 1000;
        readonly autoplayInterval: 3000;
        readonly callbackOffsetMargin: 5;
        readonly containerCustomStyle: {};
        readonly contentContainerCustomStyle: {};
        readonly enableMomentum: false;
        readonly enableSnap: true;
        readonly firstItem: 0;
        readonly hasParallaxImages: false;
        readonly inactiveSlideOpacity: 0.7;
        readonly inactiveSlideScale: 0.9;
        readonly inactiveSlideShift: 0;
        readonly layout: "default";
        readonly lockScrollTimeoutDuration: 1000;
        readonly lockScrollWhileSnapping: false;
        readonly loop: false;
        readonly loopClonesPerSide: 3;
        readonly scrollEnabled: true;
        readonly slideStyle: {};
        readonly shouldOptimizeUpdates: true;
        readonly swipeThreshold: 20;
        readonly useScrollView: false;
        readonly vertical: false;
    };
    constructor(props: CarouselAllProps<T>);
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: CarouselProps<T>, nextState: CarouselState): boolean;
    componentDidUpdate(prevProps: CarouselProps<T>): void;
    componentWillUnmount(): void;
    get realIndex(): number;
    get currentIndex(): number;
    get currentScrollPosition(): number;
    _setScrollHandler(props: CarouselProps<T>): void;
    _needsScrollView(): boolean;
    _needsRTLAdaptations(): boolean;
    _canLockScroll(): boolean;
    _enableLoop(): boolean | 0;
    _shouldAnimateSlides(props?: CarouselAllProps<T>): true;
    _shouldUseCustomAnimation(): boolean;
    _shouldUseShiftLayout(): boolean;
    _shouldUseStackLayout(): boolean;
    _shouldUseTinderLayout(): boolean;
    _getCustomData(props?: CarouselAllProps<T>): readonly T[];
    _getCustomDataLength(props?: CarouselAllProps<T>): number;
    _getCustomIndex(index: number, props?: CarouselAllProps<T>): number;
    _getDataIndex(index: number): number;
    _getPositionIndex(index: number): number;
    _getFirstItem(index: number, props?: CarouselAllProps<T>): number;
    _getWrappedRef(): ScrollView | FlatList<any>;
    _getScrollEnabled(): boolean;
    _setScrollEnabled(scrollEnabled?: boolean): void;
    _getKeyExtractor(item: T, index: number): string;
    _getScrollOffset(event: NativeSyntheticEvent<NativeScrollEvent>): number;
    _getContainerInnerMargin(opposite?: boolean): number;
    _getViewportOffset(): number;
    _getCenter(offset: number): number;
    _getActiveItem(offset: number): number;
    _initPositionsAndInterpolators(props?: CarouselAllProps<T>): void;
    _getSlideAnimation(index: number, toValue: number): Animated.CompositeAnimation | null;
    _playCustomSlideAnimation(current: number, next: number): void;
    _hackActiveSlideAnimation(index: number, goTo: 'start' | null, force?: boolean): void;
    _lockScroll(): void;
    _releaseScroll(): void;
    _repositionScroll(index: number): void;
    _scrollTo(offset: number, animated?: boolean): void;
    _onScroll(event?: NativeSyntheticEvent<NativeScrollEvent>): void;
    _onStartShouldSetResponderCapture(event: GestureResponderEvent): boolean;
    _onTouchStart(e: GestureResponderEvent): void;
    _onTouchEnd(e: GestureResponderEvent): void;
    _onScrollBeginDrag(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    _onScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    _onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    _onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    _onTouchRelease(event: GestureResponderEvent): void;
    _onLayout(event: LayoutChangeEvent): void;
    _snapScroll(delta: number): void;
    _snapToItem(index: number, animated?: boolean, fireCallback?: boolean, initial?: boolean, lockScroll?: boolean): void;
    _onBeforeSnap(index: number): void;
    _onSnap(index: number): void;
    startAutoplay(): void;
    pauseAutoPlay(): void;
    stopAutoplay(): void;
    snapToItem(index: number, animated?: boolean, fireCallback?: boolean): void;
    snapToNext(animated?: boolean, fireCallback?: boolean): void;
    snapToPrev(animated?: boolean, fireCallback?: boolean): void;
    triggerRenderingHack(offset: number): void;
    _getSlideInterpolatedStyle(index: number, animatedValue: Animated.Value): false | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<import("react-native").Falsy | ViewStyle | import("react-native").RegisteredStyle<ViewStyle>> | {
        backfaceVisibility?: Animated.Value | Animated.AnimatedInterpolation | "visible" | "hidden" | undefined;
        backgroundColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderBottomColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderBottomEndRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomLeftRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomRightRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomStartRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderEndColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderLeftColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderLeftWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderRightColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderRightWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderStartColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderStyle?: Animated.Value | Animated.AnimatedInterpolation | "solid" | "dotted" | "dashed" | undefined;
        borderTopColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderTopEndRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopLeftRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopRightRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopStartRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        opacity?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        testID?: string | Animated.Value | Animated.AnimatedInterpolation | undefined;
        elevation?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        alignContent?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "baseline" | undefined;
        alignSelf?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "baseline" | "auto" | undefined;
        aspectRatio?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderEndWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderStartWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        bottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        display?: Animated.Value | "flex" | Animated.AnimatedInterpolation | "none" | undefined;
        end?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flex?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexBasis?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexDirection?: Animated.Value | Animated.AnimatedInterpolation | "row" | "column" | "row-reverse" | "column-reverse" | undefined;
        flexGrow?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexShrink?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexWrap?: Animated.Value | Animated.AnimatedInterpolation | "wrap" | "nowrap" | "wrap-reverse" | undefined;
        height?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        justifyContent?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        margin?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginBottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginEnd?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginHorizontal?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginLeft?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginRight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginStart?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginTop?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginVertical?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        maxHeight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        maxWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        minHeight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        minWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        overflow?: Animated.Value | Animated.AnimatedInterpolation | "visible" | "hidden" | "scroll" | undefined;
        padding?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingBottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingEnd?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingHorizontal?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingLeft?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingRight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingStart?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingTop?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingVertical?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        position?: Animated.Value | Animated.AnimatedInterpolation | "absolute" | "relative" | undefined;
        right?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        start?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        top?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        width?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        zIndex?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        direction?: Animated.Value | Animated.AnimatedInterpolation | "inherit" | "ltr" | "rtl" | undefined;
        shadowColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        shadowOffset?: Animated.WithAnimatedObject<{
            width: number;
            height: number;
        }> | undefined;
        shadowOpacity?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        shadowRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        transform?: Animated.WithAnimatedArray<import("react-native").PerpectiveTransform | import("react-native").RotateTransform | import("react-native").RotateXTransform | import("react-native").RotateYTransform | import("react-native").RotateZTransform | import("react-native").ScaleTransform | import("react-native").ScaleXTransform | import("react-native").ScaleYTransform | import("react-native").TranslateXTransform | import("react-native").TranslateYTransform | import("react-native").SkewXTransform | import("react-native").SkewYTransform | import("react-native").MatrixTransform> | undefined;
        transformMatrix?: Animated.WithAnimatedArray<number> | undefined;
        rotation?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        scaleX?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        scaleY?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        translateX?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        translateY?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
    } | {
        transform: ({
            scale?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        } | {
            translateX: number | Animated.Value | Animated.AnimatedInterpolation;
        } | {
            translateY: number | Animated.Value | Animated.AnimatedInterpolation;
        })[];
        backfaceVisibility?: Animated.Value | Animated.AnimatedInterpolation | "visible" | "hidden" | undefined;
        backgroundColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderBottomColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderBottomEndRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomLeftRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomRightRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomStartRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderBottomWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderEndColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderLeftColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderLeftWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderRightColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderRightWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderStartColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderStyle?: Animated.Value | Animated.AnimatedInterpolation | "solid" | "dotted" | "dashed" | undefined;
        borderTopColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        borderTopEndRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopLeftRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopRightRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopStartRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderTopWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderWidth?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        opacity?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        testID?: string | Animated.Value | Animated.AnimatedInterpolation | undefined;
        elevation?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        alignContent?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "baseline" | undefined;
        alignSelf?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "stretch" | "baseline" | "auto" | undefined;
        aspectRatio?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderEndWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        borderStartWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        bottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        display?: Animated.Value | "flex" | Animated.AnimatedInterpolation | "none" | undefined;
        end?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flex?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexBasis?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexDirection?: Animated.Value | Animated.AnimatedInterpolation | "row" | "column" | "row-reverse" | "column-reverse" | undefined;
        flexGrow?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexShrink?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        flexWrap?: Animated.Value | Animated.AnimatedInterpolation | "wrap" | "nowrap" | "wrap-reverse" | undefined;
        height?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        justifyContent?: "center" | Animated.Value | Animated.AnimatedInterpolation | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        margin?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginBottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginEnd?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginHorizontal?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginLeft?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginRight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginStart?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginTop?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        marginVertical?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        maxHeight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        maxWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        minHeight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        minWidth?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        overflow?: Animated.Value | Animated.AnimatedInterpolation | "visible" | "hidden" | "scroll" | undefined;
        padding?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingBottom?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingEnd?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingHorizontal?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingLeft?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingRight?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingStart?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingTop?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        paddingVertical?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        position?: Animated.Value | Animated.AnimatedInterpolation | "absolute" | "relative" | undefined;
        right?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        start?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        top?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        width?: string | number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        zIndex?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        direction?: Animated.Value | Animated.AnimatedInterpolation | "inherit" | "ltr" | "rtl" | undefined;
        shadowColor?: string | Animated.Value | Animated.AnimatedInterpolation | import("react-native").OpaqueColorValue | undefined;
        shadowOffset?: Animated.WithAnimatedObject<{
            width: number;
            height: number;
        }> | undefined;
        shadowOpacity?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        shadowRadius?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        transformMatrix?: Animated.WithAnimatedArray<number> | undefined;
        rotation?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        scaleX?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        scaleY?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        translateX?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
        translateY?: number | Animated.Value | Animated.AnimatedInterpolation | undefined;
    } | {
        opacity: Animated.AnimatedInterpolation;
        transform: ({
            scale: Animated.AnimatedInterpolation;
        } | {
            [x: string]: Animated.AnimatedInterpolation;
            scale?: undefined;
        })[]; /**
         * Value of the 'scale' transform applied to inactive slides
         */
        zIndex?: undefined;
    } | {
        zIndex: number;
        opacity: Animated.AnimatedInterpolation;
        transform: ({
            scale: Animated.AnimatedInterpolation;
        } | {
            [x: string]: Animated.AnimatedInterpolation;
            scale?: undefined;
        })[];
    } | {
        opacity: Animated.AnimatedInterpolation;
        transform: ({
            scale: Animated.AnimatedInterpolation;
            rotate?: undefined;
        } | {
            rotate: Animated.AnimatedInterpolation;
            scale?: undefined;
        } | {
            [x: string]: Animated.AnimatedInterpolation;
            scale?: undefined;
            rotate?: undefined;
        })[];
        zIndex?: undefined;
    } | {
        zIndex: number;
        opacity: Animated.AnimatedInterpolation;
        transform: ({
            scale: Animated.AnimatedInterpolation;
            rotate?: undefined;
        } | {
            rotate: Animated.AnimatedInterpolation;
            scale?: undefined;
        } | {
            [x: string]: Animated.AnimatedInterpolation;
            scale?: undefined;
            rotate?: undefined;
        })[];
    } | null | undefined;
    _renderItem(arg: {
        item: T;
        index: number;
    }): JSX.Element | null;
    _getComponentOverridableProps(): ScrollViewProps | FlatListProps<unknown>;
    _getComponentStaticProps(): {
        renderItem: (arg: {
            item: T;
            index: number;
        }) => JSX.Element | null;
        numColumns: number;
        keyExtractor: ((item: T, index: number) => string) & ((item: T, index: number) => string);
        ref: (c: ScrollView | FlatList) => FlatList<any> | ScrollView;
        data: readonly T[];
        style: (ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<import("react-native").Falsy | ViewStyle | import("react-native").RegisteredStyle<ViewStyle>> | {
            height: number;
            flexDirection: string;
            width?: undefined;
        } | {
            width: number;
            flexDirection: string;
            height?: undefined;
        })[];
        contentContainerStyle: (ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<import("react-native").Falsy | ViewStyle | import("react-native").RegisteredStyle<ViewStyle>>)[];
        horizontal: boolean;
        scrollEventThrottle: number;
        onScroll: (...args: any[]) => void;
        onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onResponderRelease: (event: GestureResponderEvent) => void;
        onStartShouldSetResponderCapture: (event: GestureResponderEvent) => boolean;
        onTouchStart: (e: GestureResponderEvent) => void;
        onTouchEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onLayout: (event: LayoutChangeEvent) => void;
    } | {
        renderItem?: undefined;
        numColumns?: undefined;
        keyExtractor?: undefined;
        ref: (c: ScrollView | FlatList) => FlatList<any> | ScrollView;
        data: readonly T[];
        style: (ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<import("react-native").Falsy | ViewStyle | import("react-native").RegisteredStyle<ViewStyle>> | {
            height: number;
            flexDirection: string;
            width?: undefined;
        } | {
            width: number;
            flexDirection: string;
            height?: undefined;
        })[];
        contentContainerStyle: (ViewStyle | import("react-native").RegisteredStyle<ViewStyle> | import("react-native").RecursiveArray<import("react-native").Falsy | ViewStyle | import("react-native").RegisteredStyle<ViewStyle>>)[];
        horizontal: boolean;
        scrollEventThrottle: number;
        onScroll: (...args: any[]) => void;
        onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onResponderRelease: (event: GestureResponderEvent) => void;
        onStartShouldSetResponderCapture: (event: GestureResponderEvent) => boolean;
        onTouchStart: (e: GestureResponderEvent) => void;
        onTouchEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onLayout: (event: LayoutChangeEvent) => void;
    };
    render(): JSX.Element | null;
}
export {};
