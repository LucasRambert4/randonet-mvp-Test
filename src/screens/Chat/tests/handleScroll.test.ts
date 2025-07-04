import { createRef } from 'react';
import { handleScrollFactory } from './handleScroll';

describe('handleScroll', () => {
  it('sets isAutoScrollRef.current to true or false correctly', () => {
    const isAutoScrollRef = createRef();
    isAutoScrollRef.current = false;

    const handleScroll = handleScrollFactory(isAutoScrollRef);

    handleScroll({
      nativeEvent: {
        contentOffset: { y: 0 },
        layoutMeasurement: { height: 100 },
        contentSize: { height: 180 },
      },
    });
    expect(isAutoScrollRef.current).toBe(true);

    handleScroll({
      nativeEvent: {
        contentOffset: { y: 0 },
        layoutMeasurement: { height: 100 },
        contentSize: { height: 250 },
      },
    });
    expect(isAutoScrollRef.current).toBe(false);
  });
});
