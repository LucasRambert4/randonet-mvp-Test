import { createRef } from 'react';
import { handleScrollFactory } from './handleScroll';

describe('handleScroll', () => {
  it('sets isAutoScrollRef.current to true or false correctly', () => {
    const isAutoScrollRef = createRef();
    isAutoScrollRef.current = false;

    const handleScroll = handleScrollFactory(isAutoScrollRef);

    // Cas où ça doit être true
    handleScroll({
      nativeEvent: {
        contentOffset: { y: 0 },
        layoutMeasurement: { height: 100 },
        contentSize: { height: 180 }, // distance = 80 < 100
      },
    });
    expect(isAutoScrollRef.current).toBe(true);

    // Cas où ça doit être false
    handleScroll({
      nativeEvent: {
        contentOffset: { y: 0 },
        layoutMeasurement: { height: 100 },
        contentSize: { height: 250 }, // distance = 150 > 100
      },
    });
    expect(isAutoScrollRef.current).toBe(false);
  });
});
