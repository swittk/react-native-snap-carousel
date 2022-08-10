import React, { Component } from 'react';
import { Animated, Easing, FlatList, I18nManager, Platform, ScrollView, View, StyleProp, ViewStyle, ScrollViewProps, GestureResponderEvent, ScrollViewComponent, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent, FlatListProps } from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import {
    defaultScrollInterpolator,
    stackScrollInterpolator,
    tinderScrollInterpolator,
    defaultAnimatedStyles,
    shiftAnimatedStyles,
    stackAnimatedStyles,
    tinderAnimatedStyles
} from '../utils/animations';

const IS_IOS = Platform.OS === 'ios';

// Native driver for scroll events
// See: https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html
const AnimatedFlatList = (FlatList ? Animated.createAnimatedComponent(FlatList) : null) as Animated.AnimatedComponent<typeof FlatList>;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// React Native automatically handles RTL layouts; unfortunately, it's buggy with horizontal ScrollView
// See https://github.com/facebook/react-native/issues/11960
// NOTE: the following variable is not declared in the constructor
// otherwise it is undefined at init, which messes with custom indexes
const IS_RTL = I18nManager.isRTL;
export type CarouselAllProps<T> = {
    /**
     * Array of items to loop over
     */
    data: ReadonlyArray<T>,
    /**
     * Function that takes an item from the `data` array and returns a React
     * Element. See `react-native`'s `FlatList`
     */
    renderItem: (item: { item: T, index: number }, parallaxProps?: {
        carouselRef?: ScrollView | FlatList | undefined;
        itemHeight?: number | undefined;
        itemWidth?: number | undefined;
        scrollPosition?: Animated.Value | undefined;
        sliderHeight?: number | undefined;
        sliderWidth?: number | undefined;
        vertical?: boolean | undefined;
    }) => React.ReactNode,
    /**
     * Width in pixels of your slides, must be the same for all of them
     * Note: Required with horizontal carousel
     */
    itemWidth?: number,
    /**
     * Height in pixels of carousel's items, must be the same for all of them
     * Note: Required with vertical carousel
     */
    itemHeight?: number,
    /**
     * Width in pixels of your slider
     * Note: Required with horizontal carousel
     */
    sliderWidth?: number,
    /**
     * Height in pixels of the carousel itself
     * Note: Required with vertical carousel
     */
    sliderHeight?: number,

    // Behavior

    /**
     * From slider's center, minimum slide distance to be scrolled before being set to active
     */
    activeSlideOffset: number,
    /**
     * Duration of time while component is hidden after mounting. NOTE: May cause rendering
     * issues on Android. Defaults to 0
     */
    apparitionDelay: number,
    /**
     * Trigger autoplay on mount
     */
    autoplay: boolean,
    /**
     * Delay before enabling autoplay on startup & after releasing the touch
     */
    autoplayDelay: number,
    /**
     * Delay in ms until navigating to the next item
     */
    autoplayInterval: number,
    /**
     * Defines a small margin for callbacks firing from scroll events.  Increase this value
     * if you experience missed callbacks. Defaults to 5
     */
    callbackOffsetMargin: number,

    /**
     * Since 1.5.0, the snapping effect can now be based on momentum instead of when you're
     * releasing your finger. It means that the component will wait until the ScrollView
     * isn't moving anymore to snap
     */
    enableMomentum: boolean,
    /**
     * If enabled, releasing the touch will scroll to the center of the nearest/active item
     */
    enableSnap: boolean,
    /**
     * Index of the first item to display
     */
    firstItem: number,
    /**
     * Flag to indicate whether the carousel contains `<ParallaxImage />`. Parallax data
     * will not be passed to carousel items if this is false
     */
    hasParallaxImages: boolean,
    /**
     * Changes default lock's timeout duration in ms.
     */
    lockScrollTimeoutDuration: number,
    /**
     * Prevent the user from interacting with the carousel while it is snapping. Ignored
     * if `enableMomentum` is `true`
     */
    lockScrollWhileSnapping: boolean,
    /**
     * Enable infinite loop mode. Does not work if `enableSnap` is `false`
     */
    loop: boolean,
    /**
     * Number of clones to render at the beginning and end of the list. Default
     * is 3
     */
    loopClonesPerSide: number,
    /**
     * Allow scroll independently of user interaction on carousel. `false` as default.
     */
    scrollEnabled: boolean,
    /**
     * Whether to implement a shouldComponentUpdate strategy to minimize updates
     */
    shouldOptimizeUpdates: boolean,
    /**
     * Delta x when swiping to trigger the snap
     */
    swipeThreshold: number,
    /**
     * Determines whether to use `ScrollView` instead of `FlatList`. May cause
     * rendering performance issues due to losing `FlatList`'s performance
     * optimizations
     */
    useScrollView: boolean,
    /*
     * Layout slides vertically instead of horizontally
     */
    vertical: boolean,

    // Style and animation
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
    activeAnimationType: 'timing' | 'spring' | 'decay',
    /**
     * Determine active slide's alignment relative to the carousel
     */
    activeSlideAlignment: 'center' | 'end' | 'start',
    /**
     * Optional styles for Scrollview's global wrapper
     */
    containerCustomStyle: StyleProp<ViewStyle>,
    /**
     * Optional styles for Scrollview's items container
     */
    contentContainerCustomStyle: StyleProp<ViewStyle>,
    /**
     * Value of the opacity effect applied to inactive slides
     */
    inactiveSlideOpacity: number,
    /**
     * Value of the 'scale' transform applied to inactive slides
     */
    inactiveSlideScale: number,
    /**
     * Value of the 'translate' transform applied to inactive slides. Not recommended with
     * `customAnimationOptions`
     */
    inactiveSlideShift: number,
    /**
     * Define the way items are rendered and animated.
     * Possible values are 'default', 'stack' and 'tinder'.
     * See this for more info and visual examples.
     * WARNING: setting this prop to either 'stack' or 'tinder' will activate useScrollView to prevent rendering bugs with FlatList.
     * Therefore, those layouts will probably not be suited if you have a large data set.
     */
    layout: 'default' | 'stack' | 'tinder',
    /**
     * Use to increase or decrease the default card offset in both 'stack' and 'tinder' layouts.
     */
    layoutCardOffset?: number,
    /**
     * Used to define custom interpolations
     */
    scrollInterpolator?: (index: number, props: Readonly<CarouselProps<T>>) => { inputRange: number[], outputRange: number[] },
    /**
     * Used to define custom interpolations
     */
    slideInterpolatedStyle?: (index: number, animatedValue: Animated.AnimatedValue, carouselProps: CarouselProps<any>, cardOffset?: number) => StyleProp<ViewStyle>,
    /**
     * Optional style for each item's container (the one whose scale and opacity are animated)
     */
    slideStyle: StyleProp<ViewStyle>,

    // Callbacks
    /**
     * Exposed View callback; invoked on mount and layout changes
     */
    onLayout?: (event: LayoutChangeEvent) => void;

    /**
     * Exposed ScrollView callback; fired while scrolling
     */
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

    onBeforeSnapToItem?: (slideIndex: number) => void,
    onSnapToItem?: (slideIndex: number) => void,

    keyExtractor?: (item: T, index: number) => string
} & ScrollViewProps & FlatListProps<T>;


export type CarouselProps<T> = Omit<CarouselAllProps<T>, keyof typeof Carousel['defaultProps']> & Partial<Pick<CarouselAllProps<T>, keyof typeof Carousel['defaultProps']>>;

type CarouselState = {
    hideCarousel: boolean,
    interpolators: (Animated.Value | Animated.AnimatedInterpolation)[]
}


export default class Carousel<T> extends Component<CarouselProps<T>, CarouselState> {
    _activeItem: number;
    _previousActiveItem: number;
    _previousFirstItem: number;
    _previousItemsLength: number;
    _mounted: boolean;
    _positions: { start: number, end: number }[];
    /** store ScrollView's scroll position */
    _currentContentOffset = 0;
    _canFireBeforeCallback = false;
    _canFireCallback = false;
    _scrollOffsetRef: number | null = null;
    /** used when momentum is enabled to prevent an issue with edges items */
    _onScrollTriggered = true;
    /** used to work around a FlatList bug */
    _lastScrollDate = 0;
    _scrollEnabled: boolean;
    _scrollPos!: Animated.Value;
    _onScrollHandler!: (...args: any[]) => void;
    _ignoreNextMomentum: boolean;

    _itemToSnapTo: number = 0;
    _scrollEndOffset: number = 0;


    // Various timeouts
    _apparitionTimeout: ReturnType<typeof setTimeout> | undefined;
    _hackSlideAnimationTimeout: ReturnType<typeof setTimeout> | undefined;
    _enableAutoplayTimeout: ReturnType<typeof setTimeout> | undefined;
    _autoplayTimeout: ReturnType<typeof setTimeout> | undefined;
    _snapNoMomentumTimeout: ReturnType<typeof setTimeout> | undefined;
    _edgeItemTimeout: ReturnType<typeof setTimeout> | undefined;
    _lockScrollTimeout: ReturnType<typeof setTimeout> | undefined;
    _autoplayInterval: ReturnType<typeof setInterval> | undefined;

    _carouselRef: ScrollView | FlatList | undefined;

    _autoplay: boolean = false;
    _autoplaying: boolean = false;

    _scrollStartOffset: number = 0;
    _scrollStartActive: number = 0;
    _scrollEndActive: number = 0;

    _onLayoutInitDone: boolean = false;

    static defaultProps = {
        activeAnimationType: 'timing',
        activeAnimationOptions: null,
        activeSlideAlignment: 'center',
        activeSlideOffset: 20,
        apparitionDelay: 0,
        autoplay: false,
        autoplayDelay: 1000,
        autoplayInterval: 3000,
        callbackOffsetMargin: 5,
        containerCustomStyle: {},
        contentContainerCustomStyle: {},
        enableMomentum: false,
        enableSnap: true,
        firstItem: 0,
        hasParallaxImages: false,
        inactiveSlideOpacity: 0.7,
        inactiveSlideScale: 0.9,
        inactiveSlideShift: 0,
        layout: 'default',
        lockScrollTimeoutDuration: 1000,
        lockScrollWhileSnapping: false,
        loop: false,
        loopClonesPerSide: 3,
        scrollEnabled: true,
        slideStyle: {},
        shouldOptimizeUpdates: true,
        swipeThreshold: 20,
        useScrollView: !AnimatedFlatList,
        vertical: false
    } as const;

    constructor(props: CarouselAllProps<T>) {
        super(props);

        this.state = {
            hideCarousel: true,
            interpolators: []
        };

        // The following values are not stored in the state because 'setState()' is asynchronous
        // and this results in an absolutely crappy behavior on Android while swiping (see #156)
        const initialActiveItem = this._getFirstItem(props.firstItem);
        this._activeItem = initialActiveItem;
        this._previousActiveItem = initialActiveItem;
        this._previousFirstItem = initialActiveItem;
        this._previousItemsLength = initialActiveItem;

        this._mounted = false;
        this._positions = [];
        this._currentContentOffset = 0; // store ScrollView's scroll position
        this._canFireBeforeCallback = false;
        this._canFireCallback = false;
        this._scrollOffsetRef = null;
        this._onScrollTriggered = true; // used when momentum is enabled to prevent an issue with edges items
        this._lastScrollDate = 0; // used to work around a FlatList bug
        this._scrollEnabled = props.scrollEnabled !== false;

        this._initPositionsAndInterpolators = this._initPositionsAndInterpolators.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onSnap = this._onSnap.bind(this);

        this._onLayout = this._onLayout.bind(this);
        this._onScroll = this._onScroll.bind(this);

        // Sorry but got to cast as any to keep ts from crapping out
        this._onScrollBeginDrag = (props.enableSnap ? this._onScrollBeginDrag.bind(this) : undefined) as any;
        this._onScrollEnd = (props.enableSnap || props.autoplay ? this._onScrollEnd.bind(this) : undefined) as any;
        this._onScrollEndDrag = (!props.enableMomentum ? this._onScrollEndDrag.bind(this) : undefined) as any;
        this._onMomentumScrollEnd = (props.enableMomentum ? this._onMomentumScrollEnd.bind(this) : undefined) as any;

        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchRelease = this._onTouchRelease.bind(this);

        this._getKeyExtractor = this._getKeyExtractor.bind(this);

        /**
         * An Animated.Event(...) handler. This is set in _setScrollHandler()
         */
        this._setScrollHandler(props);

        // This bool aims at fixing an iOS bug due to scrollTo that triggers onMomentumScrollEnd.
        // onMomentumScrollEnd fires this._snapScroll, thus creating an infinite loop.
        this._ignoreNextMomentum = false;

        if (!props.vertical && (!props.sliderWidth || !props.itemWidth)) {
            console.error('react-native-snap-carousel: You need to specify both `sliderWidth` and `itemWidth` for horizontal carousels');
        }
        if (props.vertical && (!props.sliderHeight || !props.itemHeight)) {
            console.error('react-native-snap-carousel: You need to specify both `sliderHeight` and `itemHeight` for vertical carousels');
        }
        if (props.apparitionDelay && !IS_IOS && !props.useScrollView) {
            console.warn('react-native-snap-carousel: Using `apparitionDelay` on Android is not recommended since it can lead to rendering issues');
        }
    }

    componentDidMount() {
        const { apparitionDelay, autoplay, firstItem } = this.props as CarouselAllProps<T>;
        const _firstItem = this._getFirstItem(firstItem);
        const apparitionCallback = () => {
            this.setState({ hideCarousel: false });
            if (autoplay) {
                this.startAutoplay();
            }
        };

        this._mounted = true;
        this._initPositionsAndInterpolators();

        // Without 'requestAnimationFrame' or a `0` timeout, images will randomly not be rendered on Android...
        requestAnimationFrame(() => {
            if (!this._mounted) {
                return;
            }

            this._snapToItem(_firstItem, false, false, true, false);
            this._hackActiveSlideAnimation(_firstItem, 'start', true);

            if (apparitionDelay) {
                this._apparitionTimeout = setTimeout(() => {
                    apparitionCallback();
                }, apparitionDelay);
            } else {
                apparitionCallback();
            }
        });
    }

    shouldComponentUpdate(nextProps: CarouselProps<T>, nextState: CarouselState): boolean {
        if (this.props.shouldOptimizeUpdates === false) {
            return true;
        } else {
            return shallowCompare(this, nextProps, nextState);
        }
    }

    componentDidUpdate(prevProps: CarouselProps<T>) {
        const { interpolators } = this.state;
        const { firstItem, itemHeight, itemWidth, scrollEnabled, sliderHeight, sliderWidth } = this.props as CarouselAllProps<T>;
        const itemsLength = this._getCustomDataLength(this.props as CarouselAllProps<T>);

        if (!itemsLength) {
            return;
        }

        const nextFirstItem = this._getFirstItem(firstItem, this.props as CarouselAllProps<T>);
        let nextActiveItem = this._activeItem || this._activeItem === 0 ? this._activeItem : nextFirstItem;

        const hasNewSliderWidth = sliderWidth && sliderWidth !== prevProps.sliderWidth;
        const hasNewSliderHeight = sliderHeight && sliderHeight !== prevProps.sliderHeight;
        const hasNewItemWidth = itemWidth && itemWidth !== prevProps.itemWidth;
        const hasNewItemHeight = itemHeight && itemHeight !== prevProps.itemHeight;
        const hasNewScrollEnabled = scrollEnabled !== prevProps.scrollEnabled;

        // Prevent issues with dynamically removed items
        if (nextActiveItem > itemsLength - 1) {
            nextActiveItem = itemsLength - 1;
        }

        // Handle changing scrollEnabled independent of user -> carousel interaction
        if (hasNewScrollEnabled) {
            this._setScrollEnabled(scrollEnabled);
        }

        if (interpolators.length !== itemsLength || hasNewSliderWidth ||
            hasNewSliderHeight || hasNewItemWidth || hasNewItemHeight) {
            this._activeItem = nextActiveItem;
            this._previousItemsLength = itemsLength;

            this._initPositionsAndInterpolators(this.props as CarouselAllProps<T>);

            // Handle scroll issue when dynamically removing items (see #133)
            // This also fixes first item's active state on Android
            // Because 'initialScrollIndex' apparently doesn't trigger scroll
            if (this._previousItemsLength > itemsLength) {
                this._hackActiveSlideAnimation(nextActiveItem, null, true);
            }

            if (hasNewSliderWidth || hasNewSliderHeight || hasNewItemWidth || hasNewItemHeight) {
                this._snapToItem(nextActiveItem, false, false, false, false);
            }
        } else if (nextFirstItem !== this._previousFirstItem && nextFirstItem !== this._activeItem) {
            this._activeItem = nextFirstItem;
            this._previousFirstItem = nextFirstItem;
            this._snapToItem(nextFirstItem, false, true, false, false);
        }

        if (this.props.onScroll !== prevProps.onScroll) {
            this._setScrollHandler(this.props);
        }
    }

    componentWillUnmount() {
        this._mounted = false;
        this.stopAutoplay();
        this._apparitionTimeout && clearTimeout(this._apparitionTimeout);
        this._hackSlideAnimationTimeout && clearTimeout(this._hackSlideAnimationTimeout);
        this._enableAutoplayTimeout && clearTimeout(this._enableAutoplayTimeout);
        this._autoplayTimeout && clearTimeout(this._autoplayTimeout);
        this._snapNoMomentumTimeout && clearTimeout(this._snapNoMomentumTimeout);
        this._edgeItemTimeout && clearTimeout(this._edgeItemTimeout);
        this._lockScrollTimeout && clearTimeout(this._lockScrollTimeout);
    }

    get realIndex() {
        return this._activeItem;
    }

    get currentIndex() {
        return this._getDataIndex(this._activeItem);
    }

    get currentScrollPosition() {
        return this._currentContentOffset;
    }

    _setScrollHandler(props: CarouselProps<T>) {
        // Native driver for scroll events
        const scrollEventConfig = {
            listener: this._onScroll,
            useNativeDriver: true,
        };
        this._scrollPos = new Animated.Value(0);
        const argMapping = props.vertical
            ? [{ nativeEvent: { contentOffset: { y: this._scrollPos } } }]
            : [{ nativeEvent: { contentOffset: { x: this._scrollPos } } }];

        // This seems to be some legacy code fixing
        if (props.onScroll && Array.isArray((props.onScroll as any)._argMapping)) {
            // Because of a react-native issue https://github.com/facebook/react-native/issues/13294
            argMapping.pop();
            const [argMap] = (props.onScroll as any)._argMapping;
            if (argMap && argMap.nativeEvent && argMap.nativeEvent.contentOffset) {
                // Shares the same animated value passed in props
                this._scrollPos =
                    argMap.nativeEvent.contentOffset.x ||
                    argMap.nativeEvent.contentOffset.y ||
                    this._scrollPos;
            }
            argMapping.push(...(props.onScroll as any)._argMapping);
        }
        this._onScrollHandler = Animated.event(
            argMapping,
            scrollEventConfig
        );
    }

    _needsScrollView() {
        const { useScrollView } = this.props as CarouselAllProps<T>;
        return useScrollView || !AnimatedFlatList || this._shouldUseStackLayout() || this._shouldUseTinderLayout();
    }

    _needsRTLAdaptations() {
        const { vertical } = this.props as CarouselAllProps<T>;
        return IS_RTL && !IS_IOS && !vertical;
    }

    _canLockScroll() {
        const { scrollEnabled, enableMomentum, lockScrollWhileSnapping } = this.props as CarouselAllProps<T>;
        return scrollEnabled && !enableMomentum && lockScrollWhileSnapping;
    }

    _enableLoop() {
        const { data, enableSnap, loop } = this.props as CarouselAllProps<T>;
        return enableSnap && loop && data && data.length && data.length > 1;
    }

    _shouldAnimateSlides(props = this.props as CarouselAllProps<T>) {
        const { inactiveSlideOpacity, inactiveSlideScale, scrollInterpolator, slideInterpolatedStyle } = props;
        return inactiveSlideOpacity < 1 ||
            inactiveSlideScale < 1 ||
            !!scrollInterpolator ||
            !!slideInterpolatedStyle ||
            this._shouldUseShiftLayout() ||
            this._shouldUseStackLayout() ||
            this._shouldUseTinderLayout();
    }

    _shouldUseCustomAnimation() {
        const { activeAnimationOptions } = this.props as CarouselAllProps<T>;
        return !!activeAnimationOptions && !this._shouldUseStackLayout() && !this._shouldUseTinderLayout();
    }

    _shouldUseShiftLayout() {
        const { inactiveSlideShift, layout } = this.props as CarouselAllProps<T>;
        return layout === 'default' && inactiveSlideShift !== 0;
    }

    _shouldUseStackLayout() {
        return this.props.layout === 'stack';
    }

    _shouldUseTinderLayout() {
        return this.props.layout === 'tinder';
    }

    _getCustomData(props = this.props as CarouselAllProps<T>) {
        const { data, loopClonesPerSide } = props;
        const dataLength = data && data.length;

        if (!dataLength) {
            return [];
        }

        if (!this._enableLoop()) {
            return data;
        }

        let previousItems = [];
        let nextItems = [];

        if (loopClonesPerSide > dataLength) {
            const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
            const remainder = loopClonesPerSide % dataLength;

            for (let i = 0; i < dataMultiplier; i++) {
                previousItems.push(...data);
                nextItems.push(...data);
            }

            previousItems.unshift(...data.slice(-remainder));
            nextItems.push(...data.slice(0, remainder));
        } else {
            previousItems = data.slice(-loopClonesPerSide);
            nextItems = data.slice(0, loopClonesPerSide);
        }

        return previousItems.concat(data, nextItems);
    }

    _getCustomDataLength(props = this.props as CarouselAllProps<T>) {
        const { data, loopClonesPerSide } = props;
        const dataLength = data && data.length;

        if (!dataLength) {
            return 0;
        }

        return this._enableLoop() ? dataLength + (2 * loopClonesPerSide) : dataLength;
    }

    _getCustomIndex(index: number, props = this.props as CarouselAllProps<T>) {
        const itemsLength = this._getCustomDataLength(props);

        if (!itemsLength || (!index && index !== 0)) {
            return 0;
        }

        return this._needsRTLAdaptations() ? itemsLength - index - 1 : index;
    }

    _getDataIndex(index: number) {
        const { data, loopClonesPerSide } = this.props as CarouselAllProps<T>;
        const dataLength = data && data.length;

        if (!this._enableLoop() || !dataLength) {
            return index;
        }

        if (index >= dataLength + loopClonesPerSide) {
            return loopClonesPerSide > dataLength ?
                (index - loopClonesPerSide) % dataLength :
                index - dataLength - loopClonesPerSide;
        } else if (index < loopClonesPerSide) {
            // TODO: is there a simpler way of determining the interpolated index?
            if (loopClonesPerSide > dataLength) {
                const baseDataIndexes = [];
                const dataIndexes = [];
                const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
                const remainder = loopClonesPerSide % dataLength;

                for (let i = 0; i < dataLength; i++) {
                    baseDataIndexes.push(i);
                }

                for (let j = 0; j < dataMultiplier; j++) {
                    dataIndexes.push(...baseDataIndexes);
                }

                dataIndexes.unshift(...baseDataIndexes.slice(-remainder));
                return dataIndexes[index];
            } else {
                return index + dataLength - loopClonesPerSide;
            }
        } else {
            return index - loopClonesPerSide;
        }
    }

    // Used with `snapToItem()` and 'PaginationDot'
    _getPositionIndex(index: number) {
        const { loop, loopClonesPerSide } = this.props as CarouselAllProps<T>;
        return loop ? index + loopClonesPerSide : index;
    }

    _getFirstItem(index: number, props = this.props as CarouselAllProps<T>) {
        const { loopClonesPerSide } = props;
        const itemsLength = this._getCustomDataLength(props);

        if (!itemsLength || index > itemsLength - 1 || index < 0) {
            return 0;
        }

        return this._enableLoop() ? index + loopClonesPerSide : index;
    }

    _getWrappedRef(): ScrollView | FlatList<any> {
        if (this._carouselRef && (
            (this._needsScrollView() && (this._carouselRef as ScrollView).scrollTo) ||
            (!this._needsScrollView() && (this._carouselRef as FlatList).scrollToOffset)
        )) {
            return this._carouselRef;
        }
        // https://github.com/facebook/react-native/issues/10635
        // https://stackoverflow.com/a/48786374/8412141
        return this._carouselRef && (this._carouselRef as any).getNode && (this._carouselRef as any).getNode();
    }

    _getScrollEnabled() {
        return this._scrollEnabled;
    }

    _setScrollEnabled(scrollEnabled = true) {
        const wrappedRef = this._getWrappedRef();

        if (!wrappedRef || !wrappedRef.setNativeProps) {
            return;
        }

        // 'setNativeProps()' is used instead of 'setState()' because the latter
        // really takes a toll on Android behavior when momentum is disabled
        wrappedRef.setNativeProps({ scrollEnabled });
        this._scrollEnabled = scrollEnabled;
    }

    _getKeyExtractor(item: T, index: number) {
        return this._needsScrollView() ? `scrollview-item-${index}` : `flatlist-item-${index}`;
    }

    _getScrollOffset(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { vertical } = this.props as CarouselAllProps<T>;
        return (event && event.nativeEvent && event.nativeEvent.contentOffset &&
            event.nativeEvent.contentOffset[vertical ? 'y' : 'x']) || 0;
    }

    _getContainerInnerMargin(opposite = false) {
        const { sliderWidth, sliderHeight, itemWidth, itemHeight, vertical, activeSlideAlignment } = this.props as CarouselAllProps<T>;

        if ((activeSlideAlignment === 'start' && !opposite) ||
            (activeSlideAlignment === 'end' && opposite)) {
            return 0;
        } else if ((activeSlideAlignment === 'end' && !opposite) ||
            (activeSlideAlignment === 'start' && opposite)) {
            if (vertical) {
                // if ((sliderHeight == undefined) || (itemHeight == undefined)) {
                //     throw new TypeError('sliderHeight and itemHeight must be specified for vertical carousel');
                // }
                return sliderHeight! - itemHeight!;
            }
            else {
                // if ((sliderWidth == undefined) || (itemWidth == undefined)) {
                //     throw new TypeError('sliderWidth and itemWidth must be specified for horizontal carousel');
                // }
                return sliderWidth! - itemWidth!;
            }
        } else {
            if (vertical) {
                // if ((sliderHeight == undefined) || (itemHeight == undefined)) {
                //     throw new TypeError('sliderHeight and itemHeight must be specified for vertical carousel');
                // }
                return (sliderHeight! - itemHeight!) / 2;
            }
            else {
                // if ((sliderWidth == undefined) || (itemWidth == undefined)) {
                //     throw new TypeError('sliderWidth and itemWidth must be specified for horizontal carousel');
                // }
                return (sliderWidth! - itemWidth!) / 2;
            }
        }
        // sorry but I think these safety checks might be making us slowwww
    }

    _getViewportOffset() {
        const { sliderWidth, sliderHeight, itemWidth, itemHeight, vertical, activeSlideAlignment } = this.props as CarouselAllProps<T>;

        if (activeSlideAlignment === 'start') {
            return vertical ? itemHeight! / 2 : itemWidth! / 2;
        } else if (activeSlideAlignment === 'end') {
            return vertical ?
                sliderHeight! - (itemHeight! / 2) :
                sliderWidth! - (itemWidth! / 2);
        } else {
            return vertical ? sliderHeight! / 2 : sliderWidth! / 2;
        }
    }

    _getCenter(offset: number) {
        return offset + this._getViewportOffset() - this._getContainerInnerMargin();
    }

    _getActiveItem(offset: number) {
        const { activeSlideOffset, swipeThreshold } = this.props as CarouselAllProps<T>;
        const center = this._getCenter(offset);
        const centerOffset = activeSlideOffset || swipeThreshold;

        for (let i = 0; i < this._positions.length; i++) {
            const { start, end } = this._positions[i];
            if (center + centerOffset >= start && center - centerOffset <= end) {
                return i;
            }
        }

        const lastIndex = this._positions.length - 1;
        if (this._positions[lastIndex] && center - centerOffset > this._positions[lastIndex].end) {
            return lastIndex;
        }

        return 0;
    }

    _initPositionsAndInterpolators(props = this.props as CarouselAllProps<T>) {
        const { data, itemWidth, itemHeight, scrollInterpolator, vertical } = props;
        const sizeRef = vertical ? itemHeight : itemWidth;
        if (sizeRef == undefined) throw new TypeError(vertical ? 'itemHeight should be set' : 'itemWidth should be set');

        if (!data || !data.length) {
            return;
        }

        let interpolators: (Animated.Value | Animated.AnimatedInterpolation)[] = [];
        this._positions = [];

        this._getCustomData(props).forEach((itemData, index) => {
            const _index = this._getCustomIndex(index, props);
            let animatedValue: Animated.Value | Animated.AnimatedInterpolation;

            this._positions[index] = {
                start: index * sizeRef,
                end: index * sizeRef + sizeRef
            };

            if (!this._shouldAnimateSlides(props)) {
                animatedValue = new Animated.Value(1);
            } else if (this._shouldUseCustomAnimation()) {
                animatedValue = new Animated.Value(_index === this._activeItem ? 1 : 0);
            } else {
                let interpolator: {
                    inputRange: number[];
                    outputRange: number[];
                } | undefined;

                if (scrollInterpolator) {
                    interpolator = scrollInterpolator(_index, props);
                } else if (this._shouldUseStackLayout()) {
                    interpolator = stackScrollInterpolator(_index, props);
                } else if (this._shouldUseTinderLayout()) {
                    interpolator = tinderScrollInterpolator(_index, props);
                }

                if (!interpolator || !interpolator.inputRange || !interpolator.outputRange) {
                    interpolator = defaultScrollInterpolator(_index, props);
                }

                animatedValue = this._scrollPos.interpolate({
                    ...interpolator,
                    extrapolate: 'clamp'
                });
            }

            interpolators.push(animatedValue);
        });

        this.setState({ interpolators });
    }

    _getSlideAnimation(index: number, toValue: number) {
        const { interpolators } = this.state;
        const { activeAnimationType, activeAnimationOptions } = this.props as CarouselAllProps<T>;

        const animatedValue = interpolators && interpolators[index];

        if (!animatedValue /* && animatedValue !== 0 */) {
            return null;
        }

        const animationCommonOptions = {
            isInteraction: false,
            useNativeDriver: true,
            ...activeAnimationOptions,
            toValue: toValue
        };

        return Animated.parallel([
            Animated['timing'](
                (animatedValue as Animated.Value),
                { ...animationCommonOptions, easing: Easing.linear }
            ),
            Animated[activeAnimationType](
                (animatedValue as Animated.Value),
                { ...animationCommonOptions as any }
            )
        ]);
    }

    _playCustomSlideAnimation(current: number, next: number) {
        const { interpolators } = this.state;
        const itemsLength = this._getCustomDataLength();
        const _currentIndex = this._getCustomIndex(current);
        const _currentDataIndex = this._getDataIndex(_currentIndex);
        const _nextIndex = this._getCustomIndex(next);
        const _nextDataIndex = this._getDataIndex(_nextIndex);
        let animations = [];

        // Keep animations in sync when looping
        if (this._enableLoop()) {
            for (let i = 0; i < itemsLength; i++) {
                if (this._getDataIndex(i) === _currentDataIndex && interpolators[i]) {
                    animations.push(this._getSlideAnimation(i, 0));
                } else if (this._getDataIndex(i) === _nextDataIndex && interpolators[i]) {
                    animations.push(this._getSlideAnimation(i, 1));
                }
            }
        } else {
            if (interpolators[current]) {
                animations.push(this._getSlideAnimation(current, 0));
            }
            if (interpolators[next]) {
                animations.push(this._getSlideAnimation(next, 1));
            }
        }

        Animated.parallel(animations as Animated.CompositeAnimation[], { stopTogether: false }).start();
    }

    _hackActiveSlideAnimation(index: number, goTo: 'start' | null, force = false) {
        const { data } = this.props as CarouselAllProps<T>;

        if (!this._mounted || !this._carouselRef || !this._positions[index] || (!force && this._enableLoop())) {
            return;
        }

        const offset = this._positions[index] && this._positions[index].start;

        if (!offset && offset !== 0) {
            return;
        }

        const itemsLength = data && data.length;
        const direction = goTo || itemsLength === 1 ? 'start' : 'end';

        this._scrollTo(offset + (direction === 'start' ? -1 : 1), false);

        if (this._hackSlideAnimationTimeout) { clearTimeout(this._hackSlideAnimationTimeout); }
        this._hackSlideAnimationTimeout = setTimeout(() => {
            this._scrollTo(offset, false);
        }, 50); // works randomly when set to '0'
    }

    _lockScroll() {
        const { lockScrollTimeoutDuration } = this.props as CarouselAllProps<T>;
        if (this._lockScrollTimeout) { clearTimeout(this._lockScrollTimeout); }
        this._lockScrollTimeout = setTimeout(() => {
            this._releaseScroll();
        }, lockScrollTimeoutDuration);
        this._setScrollEnabled(false);
    }

    _releaseScroll() {
        if (this._lockScrollTimeout) {
            clearTimeout(this._lockScrollTimeout);
        }
        this._setScrollEnabled(true);
    }

    _repositionScroll(index: number) {
        const { data, loopClonesPerSide } = this.props as CarouselAllProps<T>;
        const dataLength = data && data.length;

        if (!this._enableLoop() || !dataLength ||
            (index >= loopClonesPerSide && index < dataLength + loopClonesPerSide)) {
            return;
        }

        let repositionTo = index;

        if (index >= dataLength + loopClonesPerSide) {
            repositionTo = index - dataLength;
        } else if (index < loopClonesPerSide) {
            repositionTo = index + dataLength;
        }

        this._snapToItem(repositionTo, false, false, false, false);
    }

    _scrollTo(offset: number, animated = true) {
        const { vertical } = this.props as CarouselAllProps<T>;
        const wrappedRef = this._getWrappedRef();

        if (!this._mounted || !wrappedRef) {
            return;
        }

        const specificOptions = this._needsScrollView() ? {
            x: vertical ? 0 : offset,
            y: vertical ? offset : 0
        } : {
            offset
        };
        const options = {
            ...specificOptions,
            animated
        };

        if (this._needsScrollView()) {
            (wrappedRef as ScrollView).scrollTo(options);
        } else {
            (wrappedRef as FlatList).scrollToOffset(options as any);
        }
    }

    _onScroll(event?: NativeSyntheticEvent<NativeScrollEvent>) {
        const { callbackOffsetMargin, enableMomentum, onScroll } = this.props as CarouselAllProps<T>;

        const scrollOffset = event ? this._getScrollOffset(event) : this._currentContentOffset;
        const nextActiveItem = this._getActiveItem(scrollOffset);
        const itemReached = nextActiveItem === this._itemToSnapTo;
        const scrollConditions = this._scrollOffsetRef !== null &&
            scrollOffset >= this._scrollOffsetRef - callbackOffsetMargin &&
            scrollOffset <= this._scrollOffsetRef + callbackOffsetMargin;

        this._currentContentOffset = scrollOffset;
        this._onScrollTriggered = true;
        this._lastScrollDate = Date.now();

        if (this._activeItem !== nextActiveItem && this._shouldUseCustomAnimation()) {
            this._playCustomSlideAnimation(this._activeItem, nextActiveItem);
        }

        if (enableMomentum) {
            if (this._snapNoMomentumTimeout) {
                clearTimeout(this._snapNoMomentumTimeout);
            }

            if (this._activeItem !== nextActiveItem) {
                this._activeItem = nextActiveItem;
            }

            if (itemReached) {
                if (this._canFireBeforeCallback) {
                    this._onBeforeSnap(this._getDataIndex(nextActiveItem));
                }

                if (scrollConditions && this._canFireCallback) {
                    this._onSnap(this._getDataIndex(nextActiveItem));
                }
            }
        } else if (this._activeItem !== nextActiveItem && itemReached) {
            if (this._canFireBeforeCallback) {
                this._onBeforeSnap(this._getDataIndex(nextActiveItem));
            }

            if (scrollConditions) {
                this._activeItem = nextActiveItem;

                if (this._canLockScroll()) {
                    this._releaseScroll();
                }

                if (this._canFireCallback) {
                    this._onSnap(this._getDataIndex(nextActiveItem));
                }
            }
        }

        if (nextActiveItem === this._itemToSnapTo &&
            scrollOffset === this._scrollOffsetRef) {
            this._repositionScroll(nextActiveItem);
        }

        if (typeof onScroll === "function" && event) {
            onScroll(event);
        }
    }

    _onStartShouldSetResponderCapture(event: GestureResponderEvent) {
        const { onStartShouldSetResponderCapture } = this.props as CarouselAllProps<T>;

        if (onStartShouldSetResponderCapture) {
            onStartShouldSetResponderCapture(event);
        }

        return this._getScrollEnabled();
    }

    _onTouchStart(e: GestureResponderEvent) {
        const { onTouchStart } = this.props

        // `onTouchStart` is fired even when `scrollEnabled` is set to `false`
        if (this._getScrollEnabled() !== false && this._autoplaying) {
            this.pauseAutoPlay();
        }

        if (onTouchStart) {
            onTouchStart(e)
        }
    }

    _onTouchEnd(e: GestureResponderEvent) {
        const { onTouchEnd } = this.props

        if (this._getScrollEnabled() !== false && this._autoplay && !this._autoplaying) {
            // This event is buggy on Android, so a fallback is provided in _onScrollEnd()
            this.startAutoplay();
        }

        if (onTouchEnd) {
            onTouchEnd(e)
        }
    }

    // Used when `enableSnap` is ENABLED
    _onScrollBeginDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { onScrollBeginDrag } = this.props as CarouselAllProps<T>;

        if (!this._getScrollEnabled()) {
            return;
        }

        this._scrollStartOffset = this._getScrollOffset(event);
        this._scrollStartActive = this._getActiveItem(this._scrollStartOffset);
        this._ignoreNextMomentum = false;
        // this._canFireCallback = false;

        if (onScrollBeginDrag) {
            onScrollBeginDrag(event);
        }
    }

    // Used when `enableMomentum` is DISABLED
    _onScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { onScrollEndDrag } = this.props as CarouselAllProps<T>;

        if (this._carouselRef) {
            this._onScrollEnd && this._onScrollEnd(event);
        }

        if (onScrollEndDrag) {
            onScrollEndDrag(event);
        }
    }

    // Used when `enableMomentum` is ENABLED
    _onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { onMomentumScrollEnd } = this.props as CarouselAllProps<T>;

        if (this._carouselRef) {
            this._onScrollEnd && this._onScrollEnd(event);
        }

        if (onMomentumScrollEnd) {
            onMomentumScrollEnd(event);
        }
    }

    _onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { autoplayDelay, enableSnap } = this.props as CarouselAllProps<T>;

        if (this._ignoreNextMomentum) {
            // iOS fix
            this._ignoreNextMomentum = false;
            return;
        }

        if (this._currentContentOffset === this._scrollEndOffset) {
            return;
        }

        this._scrollEndOffset = this._currentContentOffset;
        this._scrollEndActive = this._getActiveItem(this._scrollEndOffset);

        if (enableSnap) {
            this._snapScroll(this._scrollEndOffset - this._scrollStartOffset);
        }

        // The touchEnd event is buggy on Android, so this will serve as a fallback whenever needed
        // https://github.com/facebook/react-native/issues/9439
        if (this._autoplay && !this._autoplaying) {
            if (this._enableAutoplayTimeout) {
                clearTimeout(this._enableAutoplayTimeout);
            }
            this._enableAutoplayTimeout = setTimeout(() => {
                this.startAutoplay();
            }, autoplayDelay + 50);
        }
    }

    // Due to a bug, this event is only fired on iOS
    // https://github.com/facebook/react-native/issues/6791
    // it's fine since we're only fixing an iOS bug in it, so ...
    _onTouchRelease(event: GestureResponderEvent) {
        const { enableMomentum } = this.props as CarouselAllProps<T>;

        if (enableMomentum && IS_IOS) {
            if (this._snapNoMomentumTimeout) {
                clearTimeout(this._snapNoMomentumTimeout);
            }
            this._snapNoMomentumTimeout = setTimeout(() => {
                this._snapToItem(this._activeItem);
            }, 100);
        }
    }

    _onLayout(event: LayoutChangeEvent) {
        const { onLayout } = this.props as CarouselAllProps<T>;

        // Prevent unneeded actions during the first 'onLayout' (triggered on init)
        if (this._onLayoutInitDone) {
            this._initPositionsAndInterpolators();
            this._snapToItem(this._activeItem, false, false, false, false);
        } else {
            this._onLayoutInitDone = true;
        }

        if (onLayout) {
            onLayout(event);
        }
    }

    _snapScroll(delta: number) {
        const { swipeThreshold } = this.props as CarouselAllProps<T>;

        // When using momentum and releasing the touch with
        // no velocity, scrollEndActive will be undefined (iOS)
        if (!this._scrollEndActive && this._scrollEndActive !== 0 && IS_IOS) {
            this._scrollEndActive = this._scrollStartActive;
        }

        if (this._scrollStartActive !== this._scrollEndActive) {
            // Snap to the new active item
            this._snapToItem(this._scrollEndActive);
        } else {
            // Snap depending on delta
            if (delta > 0) {
                if (delta > swipeThreshold) {
                    this._snapToItem(this._scrollStartActive + 1);
                } else {
                    this._snapToItem(this._scrollEndActive);
                }
            } else if (delta < 0) {
                if (delta < -swipeThreshold) {
                    this._snapToItem(this._scrollStartActive - 1);
                } else {
                    this._snapToItem(this._scrollEndActive);
                }
            } else {
                // Snap to current
                this._snapToItem(this._scrollEndActive);
            }
        }
    }

    _snapToItem(index: number, animated = true, fireCallback = true, initial = false, lockScroll = true) {
        const { enableMomentum, onSnapToItem, onBeforeSnapToItem } = this.props as CarouselAllProps<T>;
        const itemsLength = this._getCustomDataLength();
        const wrappedRef = this._getWrappedRef();

        if (!itemsLength || !wrappedRef) {
            return;
        }

        if (!index || index < 0) {
            index = 0;
        } else if (itemsLength > 0 && index >= itemsLength) {
            index = itemsLength - 1;
        }

        if (index !== this._previousActiveItem) {
            this._previousActiveItem = index;

            // Placed here to allow overscrolling for edges items
            if (lockScroll && this._canLockScroll()) {
                this._lockScroll();
            }

            if (fireCallback) {
                if (onBeforeSnapToItem) {
                    this._canFireBeforeCallback = true;
                }

                if (onSnapToItem) {
                    this._canFireCallback = true;
                }
            }
        }

        this._itemToSnapTo = index;
        this._scrollOffsetRef = this._positions[index] && this._positions[index].start;
        this._onScrollTriggered = false;

        if (!this._scrollOffsetRef && this._scrollOffsetRef !== 0) {
            return;
        }

        this._scrollTo(this._scrollOffsetRef, animated);

        this._scrollEndOffset = this._currentContentOffset;

        if (enableMomentum) {
            // iOS fix, check the note in the constructor
            if (!initial) {
                this._ignoreNextMomentum = true;
            }

            // When momentum is enabled and the user is overscrolling or swiping very quickly,
            // 'onScroll' is not going to be triggered for edge items. Then callback won't be
            // fired and loop won't work since the scrollview is not going to be repositioned.
            // As a workaround, '_onScroll()' will be called manually for these items if a given
            // condition hasn't been met after a small delay.
            // WARNING: this is ok only when relying on 'momentumScrollEnd', not with 'scrollEndDrag'
            if (index === 0 || index === itemsLength - 1) {
                if (this._edgeItemTimeout) {
                    clearTimeout(this._edgeItemTimeout);
                }
                this._edgeItemTimeout = setTimeout(() => {
                    if (!initial && index === this._activeItem && !this._onScrollTriggered) {
                        this._onScroll();
                    }
                }, 250);
            }
        }
    }

    _onBeforeSnap(index: number) {
        const { onBeforeSnapToItem } = this.props as CarouselAllProps<T>;

        if (!this._carouselRef) {
            return;
        }

        this._canFireBeforeCallback = false;
        onBeforeSnapToItem && onBeforeSnapToItem(index);
    }

    _onSnap(index: number) {
        const { onSnapToItem } = this.props as CarouselAllProps<T>;

        if (!this._carouselRef) {
            return;
        }

        this._canFireCallback = false;
        onSnapToItem && onSnapToItem(index);
    }

    startAutoplay() {
        const { autoplayInterval, autoplayDelay } = this.props as CarouselAllProps<T>;
        this._autoplay = true;

        if (this._autoplaying) {
            return;
        }
        if (this._autoplayTimeout) {
            clearTimeout(this._autoplayTimeout);
        }
        this._autoplayTimeout = setTimeout(() => {
            this._autoplaying = true;
            this._autoplayInterval = setInterval(() => {
                if (this._autoplaying) {
                    this.snapToNext();
                }
            }, autoplayInterval);
        }, autoplayDelay);
    }

    pauseAutoPlay() {
        this._autoplaying = false;
        this._autoplayTimeout && clearTimeout(this._autoplayTimeout);
        this._enableAutoplayTimeout && clearTimeout(this._enableAutoplayTimeout);
        this._autoplayInterval && clearInterval(this._autoplayInterval);
    }

    stopAutoplay() {
        this._autoplay = false;
        this.pauseAutoPlay();
    }

    snapToItem(index: number, animated = true, fireCallback = true) {
        if (!index || index < 0) {
            index = 0;
        }

        const positionIndex = this._getPositionIndex(index);

        if (positionIndex === this._activeItem) {
            return;
        }

        this._snapToItem(positionIndex, animated, fireCallback);
    }

    snapToNext(animated = true, fireCallback = true) {
        const itemsLength = this._getCustomDataLength();

        let newIndex = this._activeItem + 1;
        if (newIndex > itemsLength - 1) {
            if (!this._enableLoop()) {
                return;
            }
            newIndex = 0;
        }
        this._snapToItem(newIndex, animated, fireCallback);
    }

    snapToPrev(animated = true, fireCallback = true) {
        const itemsLength = this._getCustomDataLength();

        let newIndex = this._activeItem - 1;
        if (newIndex < 0) {
            if (!this._enableLoop()) {
                return;
            }
            newIndex = itemsLength - 1;
        }
        this._snapToItem(newIndex, animated, fireCallback);
    }

    // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
    triggerRenderingHack(offset: number) {
        // Avoid messing with user scroll
        if (Date.now() - this._lastScrollDate < 500) {
            return;
        }

        const scrollPosition = this._currentContentOffset;
        if (!scrollPosition && scrollPosition !== 0) {
            return;
        }

        const scrollOffset = offset || (scrollPosition === 0 ? 1 : -1);
        this._scrollTo(scrollPosition + scrollOffset, false);
    }

    _getSlideInterpolatedStyle(index: number, animatedValue: Animated.Value) {
        const { layoutCardOffset, slideInterpolatedStyle } = this.props as CarouselAllProps<T>;

        if (slideInterpolatedStyle) {
            return slideInterpolatedStyle(index, animatedValue, this.props);
        } else if (this._shouldUseTinderLayout()) {
            return tinderAnimatedStyles(index, animatedValue, this.props, layoutCardOffset!);
        } else if (this._shouldUseStackLayout()) {
            return stackAnimatedStyles(index, animatedValue, this.props, layoutCardOffset!);
        } else if (this._shouldUseShiftLayout()) {
            return shiftAnimatedStyles(index, animatedValue, this.props);
        } else {
            return defaultAnimatedStyles(index, animatedValue, this.props);
        }
    }

    _renderItem(arg: { item: T, index: number }) {
        const { item, index } = arg;
        const { interpolators } = this.state;
        const {
            hasParallaxImages,
            itemWidth,
            itemHeight,
            keyExtractor,
            renderItem,
            sliderHeight,
            sliderWidth,
            slideStyle,
            vertical
        } = this.props as CarouselAllProps<T>;

        const animatedValue = interpolators && interpolators[index];

        if (!animatedValue /* && animatedValue !== 0 */) {
            return null;
        }

        const animate = this._shouldAnimateSlides();
        const Component = animate ? Animated.View : View;
        const animatedStyle = animate ? this._getSlideInterpolatedStyle(index, animatedValue as Animated.Value) : {} as ViewStyle;

        const parallaxProps = hasParallaxImages ? {
            scrollPosition: this._scrollPos,
            carouselRef: this._carouselRef,
            vertical,
            sliderWidth,
            sliderHeight,
            itemWidth,
            itemHeight
        } : undefined;

        const mainDimension = vertical ? { height: itemHeight } : { width: itemWidth };
        const specificProps = this._needsScrollView() ? {
            key: keyExtractor ? keyExtractor(item, index) : this._getKeyExtractor(item, index)
        } : {};

        return (
            <Component style={[mainDimension, slideStyle, animatedStyle as ViewStyle]} pointerEvents={'box-none'} {...specificProps}>
                {renderItem({ item, index }, parallaxProps)}
            </Component>
        );
    }

    _getComponentOverridableProps() {
        const {
            enableMomentum,
            itemWidth,
            itemHeight,
            loopClonesPerSide,
            sliderWidth,
            sliderHeight,
            vertical
        } = this.props as CarouselAllProps<T>;

        const visibleItems = Math.ceil(vertical ?
            sliderHeight! / itemHeight! :
            sliderWidth! / itemWidth!) + 1;
        const initialNumPerSide = this._enableLoop() ? loopClonesPerSide : 2;
        const initialNumToRender = visibleItems + (initialNumPerSide * 2);
        const maxToRenderPerBatch = 1 + (initialNumToRender * 2);
        const windowSize = maxToRenderPerBatch;

        const specificProps = !this._needsScrollView() ? {
            initialNumToRender: initialNumToRender,
            maxToRenderPerBatch: maxToRenderPerBatch,
            windowSize: windowSize
            // updateCellsBatchingPeriod
        } : {};

        return {
            decelerationRate: enableMomentum ? 0.9 : 'fast',
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            overScrollMode: 'never',
            automaticallyAdjustContentInsets: false,
            directionalLockEnabled: true,
            pinchGestureEnabled: false,
            scrollsToTop: false,
            removeClippedSubviews: !this._needsScrollView(),
            inverted: this._needsRTLAdaptations(),
            // renderToHardwareTextureAndroid: true,
            ...specificProps
        } as React.ComponentProps<typeof ScrollViewComponent | typeof FlatList>;
    }

    _getComponentStaticProps() {
        const { hideCarousel } = this.state;
        const {
            containerCustomStyle,
            contentContainerCustomStyle,
            keyExtractor,
            sliderWidth,
            sliderHeight,
            style,
            vertical
        } = this.props as CarouselAllProps<T>;

        const containerStyle = [
            containerCustomStyle || style || {},
            hideCarousel ? { opacity: 0 } : {},
            vertical ?
                { height: sliderHeight, flexDirection: 'column' } :
                // LTR hack; see https://github.com/facebook/react-native/issues/11960
                // and https://github.com/facebook/react-native/issues/13100#issuecomment-328986423
                { width: sliderWidth, flexDirection: this._needsRTLAdaptations() ? 'row-reverse' : 'row' }
        ];
        const contentContainerStyle = [
            vertical ? {
                paddingTop: this._getContainerInnerMargin(),
                paddingBottom: this._getContainerInnerMargin(true)
            } : {
                paddingLeft: this._getContainerInnerMargin(),
                paddingRight: this._getContainerInnerMargin(true)
            },
            contentContainerCustomStyle || {}
        ];

        const specificProps = !this._needsScrollView() ? {
            // extraData: this.state,
            renderItem: this._renderItem,
            numColumns: 1,
            keyExtractor: keyExtractor || this._getKeyExtractor
        } : {};

        return {
            ref: (c: ScrollView | FlatList) => this._carouselRef = c,
            data: this._getCustomData(),
            style: containerStyle,
            contentContainerStyle: contentContainerStyle,
            horizontal: !vertical,
            scrollEventThrottle: 1,
            onScroll: this._onScrollHandler,
            onScrollBeginDrag: this._onScrollBeginDrag,
            onScrollEndDrag: this._onScrollEndDrag,
            onMomentumScrollEnd: this._onMomentumScrollEnd,
            onResponderRelease: this._onTouchRelease,
            onStartShouldSetResponderCapture: this._onStartShouldSetResponderCapture,
            onTouchStart: this._onTouchStart,
            onTouchEnd: this._onScrollEnd,
            onLayout: this._onLayout,
            ...specificProps
        };
    }

    render() {
        const { data, renderItem, useScrollView } = this.props as CarouselAllProps<T>;

        if (!data || !renderItem) {
            return null;
        }

        const props = {
            ...this._getComponentOverridableProps(),
            ...this.props,
            ...this._getComponentStaticProps()
        };

        const ScrollViewComponent = typeof useScrollView === 'function' ? useScrollView : AnimatedScrollView
        return this._needsScrollView() ? (
            <ScrollViewComponent {...props as any}>
                {
                    this._getCustomData().map((item, index) => {
                        return this._renderItem({ item, index });
                    })
                }
            </ScrollViewComponent>
        ) : (
            <AnimatedFlatList {...props as any} />
        );
    }
}
