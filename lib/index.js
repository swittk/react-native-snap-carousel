"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputRangeFromIndexes = exports.ParallaxImage = exports.Pagination = exports.default = void 0;
const Carousel_1 = __importDefault(require("./carousel/Carousel"));
exports.default = Carousel_1.default;
const Pagination_1 = __importDefault(require("./pagination/Pagination"));
exports.Pagination = Pagination_1.default;
const ParallaxImage_1 = __importDefault(require("./parallaximage/ParallaxImage"));
exports.ParallaxImage = ParallaxImage_1.default;
const animations_1 = require("./utils/animations");
Object.defineProperty(exports, "getInputRangeFromIndexes", { enumerable: true, get: function () { return animations_1.getInputRangeFromIndexes; } });
//# sourceMappingURL=index.js.map