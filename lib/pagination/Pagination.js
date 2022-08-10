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
const PaginationDot_1 = __importDefault(require("./PaginationDot"));
const Pagination_style_1 = __importDefault(require("./Pagination.style"));
const IS_IOS = react_native_1.Platform.OS === 'ios';
const IS_RTL = react_native_1.I18nManager.isRTL;
class Pagination extends react_1.PureComponent {
    static defaultProps = {
        inactiveDotOpacity: 0.5,
        inactiveDotScale: 0.5,
        tappableDots: false,
        vertical: false,
        animatedDuration: 250,
        animatedFriction: 4,
        animatedTension: 50,
        delayPressInDot: 0,
    };
    constructor(props) {
        super(props);
        // Warnings
        if ((props.dotColor && !props.inactiveDotColor) || (!props.dotColor && props.inactiveDotColor)) {
            console.warn('react-native-snap-carousel | Pagination: ' +
                'You need to specify both `dotColor` and `inactiveDotColor`');
        }
        if ((props.dotElement && !props.inactiveDotElement) || (!props.dotElement && props.inactiveDotElement)) {
            console.warn('react-native-snap-carousel | Pagination: ' +
                'You need to specify both `dotElement` and `inactiveDotElement`');
        }
        if (props.tappableDots && props.carouselRef === undefined) {
            console.warn('react-native-snap-carousel | Pagination: ' +
                'You must specify prop `carouselRef` when setting `tappableDots` to `true`');
        }
    }
    _needsRTLAdaptations() {
        const { vertical } = this.props;
        return IS_RTL && !IS_IOS && !vertical;
    }
    get _activeDotIndex() {
        const { activeDotIndex, dotsLength } = this.props;
        return this._needsRTLAdaptations() ? dotsLength - activeDotIndex - 1 : activeDotIndex;
    }
    get dots() {
        const { activeOpacity = 0, carouselRef, dotsLength, dotColor, dotContainerStyle, dotElement, dotStyle, inactiveDotColor, inactiveDotElement, inactiveDotOpacity, inactiveDotScale, inactiveDotStyle, renderDots, tappableDots, animatedDuration, animatedFriction, animatedTension, delayPressInDot, } = this.props;
        if (renderDots) {
            return renderDots(this._activeDotIndex, dotsLength, this);
        }
        const DefaultDot = react_1.default.createElement(PaginationDot_1.default, { carouselRef: carouselRef, tappable: tappableDots && typeof carouselRef !== 'undefined', activeOpacity: activeOpacity, color: dotColor, containerStyle: dotContainerStyle, style: dotStyle, inactiveColor: inactiveDotColor, inactiveOpacity: inactiveDotOpacity, inactiveScale: inactiveDotScale, inactiveStyle: inactiveDotStyle, animatedDuration: animatedDuration, animatedFriction: animatedFriction, animatedTension: animatedTension, delayPressInDot: delayPressInDot });
        const dots = [...Array(dotsLength).keys()].map(i => {
            const isActive = i === this._activeDotIndex;
            return react_1.default.cloneElement((isActive ? dotElement : inactiveDotElement) || DefaultDot, {
                key: `pagination-dot-${i}`,
                active: isActive,
                index: i
            });
        });
        return dots;
    }
    render() {
        const { dotsLength, containerStyle, vertical, accessibilityLabel } = this.props;
        if (!dotsLength || dotsLength < 2) {
            return false;
        }
        const style = [
            Pagination_style_1.default.sliderPagination,
            {
                flexDirection: vertical ?
                    'column' :
                    (this._needsRTLAdaptations() ? 'row-reverse' : 'row')
            },
            containerStyle
        ];
        return (react_1.default.createElement(react_native_1.View, { pointerEvents: 'box-none', style: style, accessible: !!accessibilityLabel, accessibilityLabel: accessibilityLabel }, this.dots));
    }
}
exports.default = Pagination;
//# sourceMappingURL=Pagination.js.map