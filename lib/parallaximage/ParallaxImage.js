"use strict";
// Parallax effect inspired by https://github.com/oblador/react-native-parallax/
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
const ParallaxImage_style_1 = __importDefault(require("./ParallaxImage.style"));
class ParallaxImage extends react_1.Component {
    _container = null;
    _mounted = false;
    static defaultProps = {
        containerStyle: {},
        fadeDuration: 500,
        parallaxFactor: 0.3,
        showSpinner: true,
        spinnerColor: 'rgba(0, 0, 0, 0.4)',
        AnimatedImageComponent: react_native_1.Animated.Image
    };
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            width: 0,
            height: 0,
            status: 1,
            animOpacity: new react_native_1.Animated.Value(0)
        };
        this._onLoad = this._onLoad.bind(this);
        this._onError = this._onError.bind(this);
        this._measureLayout = this._measureLayout.bind(this);
    }
    setNativeProps(nativeProps) {
        this._container.setNativeProps(nativeProps);
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
            const { dimensions, vertical, carouselRef, sliderWidth, sliderHeight, itemWidth, itemHeight } = this.props;
            if (carouselRef) {
                this._container.measureLayout((0, react_native_1.findNodeHandle)(carouselRef), (x, y, width, height) => {
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
                }, () => {
                    // lol do nothing when fail
                });
            }
        }
    }
    _onLoad(event) {
        const { animOpacity } = this.state;
        const { fadeDuration, onLoad } = this.props;
        if (!this._mounted) {
            return;
        }
        this.setState({ status: 2 });
        if (onLoad) {
            onLoad(event);
        }
        react_native_1.Animated.timing(animOpacity, {
            toValue: 1,
            duration: fadeDuration,
            easing: react_native_1.Easing.out(react_native_1.Easing.quad),
            isInteraction: false,
            useNativeDriver: true
        }).start(() => {
            this.setState({ status: 3 });
        });
    }
    // If arg is missing from method signature, it just won't be called
    _onError(event) {
        const { onError } = this.props;
        this.setState({ status: 4 });
        if (onError) {
            onError(event);
        }
    }
    get image() {
        const { status, animOpacity, offset, width, height } = this.state;
        const { scrollPosition, dimensions, vertical, sliderWidth, sliderHeight, parallaxFactor, style, AnimatedImageComponent, ...other } = this.props;
        const parallaxPadding = (vertical ? height : width) * parallaxFactor;
        const requiredStyles = { position: 'relative' };
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
        return (react_1.default.createElement(AnimatedImageComponent, { ...other, style: [ParallaxImage_style_1.default.image, style, requiredStyles, dynamicStyles], onLoad: this._onLoad, onError: status !== 3 ? this._onError : undefined }));
    }
    get spinner() {
        const { status } = this.state;
        const { showSpinner, spinnerColor } = this.props;
        return status === 1 && showSpinner ? (react_1.default.createElement(react_native_1.View, { style: ParallaxImage_style_1.default.loaderContainer },
            react_1.default.createElement(react_native_1.ActivityIndicator, { size: 'small', color: spinnerColor, animating: true }))) : false;
    }
    render() {
        const { containerStyle } = this.props;
        return (react_1.default.createElement(react_native_1.View, { ref: (c) => { this._container = c; }, pointerEvents: 'none', style: [containerStyle, ParallaxImage_style_1.default.container], onLayout: this._measureLayout },
            this.image,
            this.spinner));
    }
}
exports.default = ParallaxImage;
//# sourceMappingURL=ParallaxImage.js.map