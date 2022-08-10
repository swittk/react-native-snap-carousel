"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Pagination_style_1 = __importDefault(require("./Pagination.style"));
class PaginationDot extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            animColor: new react_native_1.Animated.Value(0),
            animOpacity: new react_native_1.Animated.Value(0),
            animTransform: new react_native_1.Animated.Value(0)
        };
    }
    componentDidMount() {
        if (this.props.active) {
            this._animate(1);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.active !== this.props.active) {
            this._animate(this.props.active ? 1 : 0);
        }
    }
    _animate(toValue = 0) {
        const { animColor, animOpacity, animTransform } = this.state;
        const { animatedDuration, animatedFriction, animatedTension } = this.props;
        const commonProperties = {
            toValue,
            duration: animatedDuration,
            isInteraction: false,
            useNativeDriver: !this._shouldAnimateColor
        };
        let animations = [
            react_native_1.Animated.timing(animOpacity, {
                easing: react_native_1.Easing.linear,
                ...commonProperties
            }),
            react_native_1.Animated.spring(animTransform, {
                friction: animatedFriction,
                tension: animatedTension,
                ...commonProperties
            })
        ];
        if (this._shouldAnimateColor) {
            animations.push(react_native_1.Animated.timing(animColor, {
                easing: react_native_1.Easing.linear,
                ...commonProperties
            }));
        }
        react_native_1.Animated.parallel(animations).start();
    }
    get _shouldAnimateColor() {
        const { color, inactiveColor } = this.props;
        return color && inactiveColor;
    }
    render() {
        const { animColor, animOpacity, animTransform } = this.state;
        const { active, activeOpacity, carouselRef, color, containerStyle, inactiveColor, inactiveStyle, inactiveOpacity, inactiveScale, index, style, tappable, delayPressInDot } = this.props;
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
            Pagination_style_1.default.sliderPaginationDotContainer,
            containerStyle || {}
        ];
        const dotStyle = [
            Pagination_style_1.default.sliderPaginationDot,
            style || {},
            (!active && inactiveStyle) || {},
            animatedStyle,
            animatedColor
        ];
        const onPress = tappable ? () => {
            try {
                const currentRef = carouselRef.current;
                currentRef._snapToItem(currentRef._getPositionIndex(index || 0));
            }
            catch (error) {
                console.warn('react-native-snap-carousel | Pagination: ' +
                    '`carouselRef` has to be a Carousel ref.\n' + error);
            }
        } : undefined;
        return (react_1.default.createElement(react_native_1.TouchableOpacity, { accessible: false, style: dotContainerStyle, activeOpacity: tappable ? activeOpacity : 1, onPress: onPress, delayPressIn: delayPressInDot },
            react_1.default.createElement(react_native_1.Animated.View, { style: dotStyle })));
    }
}
exports.default = PaginationDot;
//# sourceMappingURL=PaginationDot.js.map