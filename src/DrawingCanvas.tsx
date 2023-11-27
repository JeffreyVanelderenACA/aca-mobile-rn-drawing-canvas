import {
  Canvas,
  Path,
  Skia,
  type SkiaDefaultProps,
  type SkImage,
  type SkPath,
  type TouchInfo,
  useCanvasRef,
  useTouchHandler,
} from '@shopify/react-native-skia';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { type PathProps } from '@shopify/react-native-skia/src/dom/types';
import { type SkRect } from '@shopify/react-native-skia/lib/typescript/src/skia/types';

export type Props = {
  pathConfig?: Partial<SkiaDefaultProps<PathProps, 'start' | 'end'>>;
  disabled?: boolean;
  style?: ViewStyle;
  onDrawStart?: () => void;
  onDrawEnd?: () => void;
};

export type DrawingCanvasRef = {
  clearPaths: () => void;
  takeSnapshot: (rectangle?: SkRect) => SkImage | undefined;
};

export const DrawingCanvas = forwardRef<DrawingCanvasRef, Props>(
  ({ pathConfig, disabled, style, onDrawStart, onDrawEnd }, ref) => {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<SkPath[]>([]);

    useImperativeHandle<unknown, DrawingCanvasRef>(
      ref,
      () => ({
        clearPaths: () => setPaths([]),
        takeSnapshot: rectangle =>
          canvasRef.current?.makeImageSnapshot(rectangle),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [canvasRef.current],
    );

    const onDrawingStart = useCallback(
      ({ x, y }: TouchInfo) => {
        setPaths(old => {
          const newPath = Skia.Path.Make();
          newPath.moveTo(x, y);
          newPath.addCircle(x, y, 0.2);
          return [...old, newPath];
        });
        onDrawStart?.();
      },
      [onDrawStart],
    );

    const onDrawingActive = useCallback(({ x, y }: TouchInfo) => {
      setPaths(currentPaths => {
        const currentPath = currentPaths[currentPaths.length - 1]!;
        const lastPoint = currentPath.getLastPt();
        const xMid = (lastPoint.x + x) / 2;
        const yMid = (lastPoint.y + y) / 2;

        currentPath.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
        return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
      });
    }, []);

    const touchHandler = useTouchHandler(
      disabled
        ? {}
        : {
          onActive: onDrawingActive,
          onStart: onDrawingStart,
          onEnd: onDrawEnd,
        },
      [onDrawingActive, onDrawingStart, onDrawEnd, disabled],
    );

    return (
      <Canvas
        ref={canvasRef}
        style={[S.container, style]}
        onTouch={touchHandler}>
        {paths.map((p, index) => (
          <Path
            color={'black'}
            style={'stroke'}
            strokeWidth={2}
            {...pathConfig}
            key={index}
            path={p}
          />
        ))}
      </Canvas>
    );
  },
);

const S = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
