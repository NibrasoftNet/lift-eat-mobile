import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

const { width } = Dimensions.get('window');

interface RulerPickerProps {
  /**
   * The initial value of the picker.
   * @default 68
   */
  initialValue?: number;

  /**
   * The minimum value allowed by the picker.
   * @default 8
   */
  minValue?: number;

  /**
   * The maximum value allowed by the picker.
   * @default 230
   */
  maxValue?: number;

  /**
   * The step between each value in the picker.
   * @default 0.1
   */
  step?: number;

  /**
   * The unit of measurement displayed with the value.
   * @default "Kg"
   */
  unit?: string;

  /**
   * Callback function triggered when the value changes.
   * @param value - The new value selected by the picker.
   */
  onValueChange?: (value: number) => void;

  /**
   * Style for the ruler container.
   */
  rulerStyle?: ViewStyle;

  /**
   * Style for each scale item.
   */
  scaleItemStyle?: ViewStyle;

  /**
   * Style for the line elements on the ruler.
   */
  lineStyle?: ViewStyle;

  /**
   * Style for the text elements of scale values.
   */
  textStyle?: TextStyle;

  /**
   * Style for the unit text (e.g., "Kg").
   */
  unitStyle?: TextStyle;

  /**
   * Style for the center line of the ruler.
   */
  centerLineStyle?: ViewStyle;

  /**
   * Style for the scale wrapper.
   */
  scaleWrapperStyle?: ViewStyle;

  /**
   * Style for the weight text.
   */
  weightTextStyle?: TextStyle;

  /**
   * Style for the weight container.
   */
  weightContainerStyle?: ViewStyle;
}

const ITEM_WIDTH = 8;
const CENTER_OFFSET = (width - ITEM_WIDTH) / 2;

const RulerPicker: React.FC<RulerPickerProps> = React.memo(
  ({
    initialValue = 68,
    minValue = 8,
    maxValue = 230,
    unit = 'Kg',
    step = 0.1,
    onValueChange,
    rulerStyle,
    scaleItemStyle,
    lineStyle,
    textStyle,
    unitStyle,
    centerLineStyle,
    scaleWrapperStyle,
    weightTextStyle,
    weightContainerStyle,
  }) => {
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const scrollViewRef = useRef<ScrollView>(null);

    const generateScaleData = () => {
      const data = [];
      for (let i = minValue; i <= maxValue; i += step) {
        data.push(Number(i.toFixed(1)));
      }
      return data;
    };

    const scaleData = generateScaleData();

    const handleScrollEnd = useCallback(
      (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / ITEM_WIDTH);
        const value = scaleData[index];
        setSelectedValue(value);
        onValueChange?.(value);

        const newOffsetX =
          index * ITEM_WIDTH - CENTER_OFFSET + (width / 2 - ITEM_WIDTH / 2);
        scrollViewRef.current?.scrollTo({ x: newOffsetX, animated: true });
      },
      [scaleData, onValueChange],
    );

    useLayoutEffect(() => {
      const initialIndex = Math.round((initialValue - minValue) / step);
      const initialOffsetX = initialIndex * ITEM_WIDTH - CENTER_OFFSET;
      scrollViewRef.current?.scrollTo({
        x: initialOffsetX + (width / 2 - ITEM_WIDTH / 2),
        animated: false,
      });
    }, [initialValue, minValue, step]);

    return (
      <View style={[styles.container, rulerStyle]}>
        <View style={[styles.weightContainer, weightContainerStyle]}>
          <Text style={[styles.weightText, weightTextStyle]}>
            {selectedValue}
          </Text>
          <Text style={[styles.unitText, unitStyle]}>{unit}</Text>
        </View>
        <View style={[styles.rulerContainer, rulerStyle]}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.scaleWrapper, scaleWrapperStyle]}
            onMomentumScrollEnd={handleScrollEnd}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
          >
            {scaleData.map((item, index) => (
              <ScaleItem
                key={index}
                item={item}
                index={index}
                lineStyle={lineStyle}
                textStyle={textStyle}
                scaleItemStyle={scaleItemStyle}
              />
            ))}
          </ScrollView>
          <View style={[styles.centerLine, centerLineStyle]} />
        </View>
      </View>
    );
  },
);

interface ScaleItemProps {
  /**
   * The scale value to display.
   */
  item: number;

  /**
   * The index of the scale item in the scale array.
   */
  index: number;

  /**
   * Style for the line element of the scale item.
   */
  lineStyle?: ViewStyle;

  /**
   * Style for the text displaying the scale value.
   */
  textStyle?: TextStyle;

  /**
   * Style for the individual scale item.
   */
  scaleItemStyle?: ViewStyle;
}

const ScaleItem: React.FC<ScaleItemProps> = React.memo(
  ({ item, index, lineStyle, textStyle, scaleItemStyle }) => (
    <View style={[styles.scaleItem, scaleItemStyle]}>
      <View
        style={[
          styles.line,
          lineStyle,
          index % 10 === 0
            ? styles.longLine
            : index % 1 === 0
              ? styles.shortLine
              : null,
        ]}
      />
      {index % 10 === 0 && (
        <Text style={[styles.valueText, textStyle]}>{item}</Text>
      )}
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
    marginTop: 0,
    justifyContent: 'center',
  },
  weightText: {
    fontSize: 60,
    fontWeight: '700',
    color: '#000819',
    lineHeight: 71,
  },
  unitText: {
    fontSize: 24,
    color: '#000819',
    marginLeft: 2,
    fontWeight: '600',
    lineHeight: 29,
  },
  rulerContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  scaleWrapper: {
    flexDirection: 'row',
    paddingHorizontal: width / 2 - 4,
  },
  scaleItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    marginBottom: 30,
  },
  line: {
    width: 1,
    backgroundColor: '#000819',
  },
  longLine: {
    height: 40,
  },
  shortLine: {
    height: 24,
    opacity: 0.3,
  },
  valueText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    bottom: -23,
    width: 80,
    lineHeight: 17,
    textAlign: 'center',
  },
  centerLine: {
    position: 'absolute',
    height: 60,
    bottom: 30,
    left: CENTER_OFFSET + ITEM_WIDTH / 2 - 1,
    width: 2,
    backgroundColor: '#004CFF',
  },
});

export default RulerPicker;
