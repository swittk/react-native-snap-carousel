"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
exports.default = react_native_1.StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        position: 'relative',
        resizeMode: 'cover',
        width: undefined,
        height: undefined
    },
    loaderContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
//# sourceMappingURL=ParallaxImage.style.js.map