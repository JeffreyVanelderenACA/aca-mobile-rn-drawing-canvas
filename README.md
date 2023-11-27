# aca-mobile-rn-drawing-canvas

This package supports drawing on a canvas via Skia. This can be used for signatures or any other requirement which involves drawing and using the result.

## Installation

```sh
npm install aca-mobile-rn-drawing-canvas
```

This library uses `react-native-skia` and `react-native-gesture-handler` to handle touch events. Don't  forget to add the `GestureHandlerRootView` in the root of your app!

## Usage

```js
import React, {useRef, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { DrawingCanvas } from 'aca-mobile-rn-drawing-canvas';

const App = () => {
  const drawingCanvasRef = useRef<DrawingCanvasRef | null>(null);
  const [isDrawingDisabled, setIsDrawingDisabled] = useState<boolean>(false);

  const Controls = (
    <View style={S.row}>
      <Pressable
        style={[S.controlButton, S.clearButton]}
        onPress={() => drawingCanvasRef.current?.clearPaths()}>
        <Text>Clear</Text>
      </Pressable>
      <Pressable
        style={[S.controlButton, S.takeSnapshotButton]}
        onPress={() =>
          console.log(
            'Took snapshot!',
            drawingCanvasRef.current?.takeSnapshot()?.encodeToBase64(),
          )
        }>
        <Text>Take snapshot</Text>
      </Pressable>
      <Pressable
        style={[S.controlButton, S.disableButton]}
        onPress={() => setIsDrawingDisabled(previous => !previous)}>
        <Text>{isDrawingDisabled ? 'Enable' : 'Disable'}</Text>
      </Pressable>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        {Controls}
        <DrawingCanvas
          ref={drawingCanvasRef}
          onDrawStart={() => console.log('drawing started')}
          onDrawEnd={() => console.log('drawing ended')}
          disabled={isDrawingDisabled}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
