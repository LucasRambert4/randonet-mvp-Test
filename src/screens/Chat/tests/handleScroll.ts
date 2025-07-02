export function handleScrollFactory(isAutoScrollRef: any) {
  return (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    isAutoScrollRef.current = distanceFromBottom < 100;
  };
}
