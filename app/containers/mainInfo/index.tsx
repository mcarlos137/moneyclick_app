//PRINCIPAL
import React, { createRef, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
//COMPONENTS
import Body_Buttons from './components/Body_Buttons'
import Body_Carrousel from './components/Body_Carrousel'
import Body_Dots from './components/Body_Dots'

const MainInfoScreen = ({ navigation, route }) => {

  //INITIAL STATES
  const [scrollViewRef, setScrollViewRef] = useState<RefObject<any>>(createRef())
  const scrollViewContentOffsetX = useRef(0);
  const [updateCount, setUpdateCount] = useState(0)

  //EFFECTS
  useEffect(() => {
    const interval = setInterval(() => {
      let currentScrollViewContentOffsetX = scrollViewContentOffsetX.current + Dimensions.get('window').width
      if (currentScrollViewContentOffsetX > Dimensions.get('window').width * 3) {
        currentScrollViewContentOffsetX = 0
      }
      scrollViewRef.current?.scrollTo({ x: currentScrollViewContentOffsetX, animated: true });
    }, 5000)
    return () => clearInterval(interval);
  }, [])

  //CALLBACKS
  const onScrollViewContentOffsetX = useCallback((e) => {
    scrollViewContentOffsetX.current = e.nativeEvent.contentOffset.x
    setUpdateCount(updateCount => updateCount + 1)
  }, [])

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1
    }}>
      <Body_Carrousel
        scrollViewRef={scrollViewRef}
        onScroll={onScrollViewContentOffsetX}
      />
      <Body_Buttons navigation={navigation} />
      <Body_Dots scrollViewContentOffsetX={scrollViewContentOffsetX.current} />
    </View >
  );
};

export default React.memo(MainInfoScreen);
