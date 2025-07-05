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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var width = react_native_1.Dimensions.get("window").width;
var ITEM_WIDTH = 8;
var CENTER_OFFSET = (width - ITEM_WIDTH) / 2;
var RulerPicker = react_1.default.memo(function (_a) {
    var _b = _a.initialValue, initialValue = _b === void 0 ? 68 : _b, _c = _a.minValue, minValue = _c === void 0 ? 8 : _c, _d = _a.maxValue, maxValue = _d === void 0 ? 230 : _d, _e = _a.unit, unit = _e === void 0 ? "Kg" : _e, _f = _a.step, step = _f === void 0 ? 0.1 : _f, onValueChange = _a.onValueChange, rulerStyle = _a.rulerStyle, scaleItemStyle = _a.scaleItemStyle, lineStyle = _a.lineStyle, textStyle = _a.textStyle, unitStyle = _a.unitStyle, centerLineStyle = _a.centerLineStyle, scaleWrapperStyle = _a.scaleWrapperStyle, weightTextStyle = _a.weightTextStyle, weightContainerStyle = _a.weightContainerStyle;
    var _g = (0, react_1.useState)(initialValue), selectedValue = _g[0], setSelectedValue = _g[1];
    var scrollViewRef = (0, react_1.useRef)(null);
    var generateScaleData = function () {
        var data = [];
        for (var i = minValue; i <= maxValue; i += step) {
            data.push(Number(i.toFixed(1)));
        }
        return data;
    };
    var scaleData = generateScaleData();
    var handleScrollEnd = (0, react_1.useCallback)(function (event) {
        var _a;
        var offsetX = event.nativeEvent.contentOffset.x;
        var index = Math.round(offsetX / ITEM_WIDTH);
        var value = scaleData[index];
        setSelectedValue(value);
        onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(value);
        var newOffsetX = index * ITEM_WIDTH - CENTER_OFFSET + (width / 2 - ITEM_WIDTH / 2);
        (_a = scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ x: newOffsetX, animated: true });
    }, [scaleData, onValueChange]);
    (0, react_1.useLayoutEffect)(function () {
        var _a;
        var initialIndex = Math.round((initialValue - minValue) / step);
        var initialOffsetX = initialIndex * ITEM_WIDTH - CENTER_OFFSET;
        (_a = scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
            x: initialOffsetX + (width / 2 - ITEM_WIDTH / 2),
            animated: false,
        });
    }, [initialValue, minValue, step]);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [styles.container, rulerStyle], children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [styles.weightContainer, weightContainerStyle], children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.weightText, weightTextStyle], children: selectedValue }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.unitText, unitStyle], children: unit })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [styles.rulerContainer, rulerStyle], children: [(0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { ref: scrollViewRef, horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: [styles.scaleWrapper, scaleWrapperStyle], onMomentumScrollEnd: handleScrollEnd, snapToInterval: ITEM_WIDTH, decelerationRate: "fast", children: scaleData.map(function (item, index) { return ((0, jsx_runtime_1.jsx)(ScaleItem, { item: item, index: index, lineStyle: lineStyle, textStyle: textStyle, scaleItemStyle: scaleItemStyle }, index)); }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [styles.centerLine, centerLineStyle] })] })] }));
});
var ScaleItem = react_1.default.memo(function (_a) {
    var item = _a.item, index = _a.index, lineStyle = _a.lineStyle, textStyle = _a.textStyle, scaleItemStyle = _a.scaleItemStyle;
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [styles.scaleItem, scaleItemStyle], children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: [
                styles.line,
                lineStyle,
                index % 10 === 0
                    ? styles.longLine
                    : index % 1 === 0
                        ? styles.shortLine
                        : null,
            ] }), index % 10 === 0 && (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.valueText, textStyle], children: item })] }));
});
var styles = react_native_1.StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    weightContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 20,
        marginTop: 40,
        justifyContent: "center",
    },
    weightText: {
        fontSize: 60,
        fontWeight: "700",
        color: "#000819",
        lineHeight: 71,
    },
    unitText: {
        fontSize: 24,
        color: "#000819",
        marginLeft: 2,
        fontWeight: "600",
        lineHeight: 29,
    },
    rulerContainer: {
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        position: "relative",
    },
    scaleWrapper: {
        flexDirection: "row",
        paddingHorizontal: width / 2 - 4,
    },
    scaleItem: {
        width: ITEM_WIDTH,
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        marginBottom: 30,
    },
    line: {
        width: 1,
        backgroundColor: "#000819",
    },
    longLine: {
        height: 40,
    },
    shortLine: {
        height: 24,
        opacity: 0.3,
    },
    valueText: {
        position: "absolute",
        fontSize: 14,
        fontWeight: "500",
        color: "#000",
        bottom: -23,
        width: 80,
        lineHeight: 17,
        textAlign: "center",
    },
    centerLine: {
        position: "absolute",
        height: 60,
        bottom: 30,
        left: CENTER_OFFSET + ITEM_WIDTH / 2 - 1,
        width: 2,
        backgroundColor: "#004CFF",
    },
});
exports.default = RulerPicker;