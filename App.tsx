import React, { useRef, useState } from "react";
import { Animated, Easing, Pressable, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.Pressable`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  const [up, setUp] = useState(true);
  const Y_POSITION = useRef(new Animated.Value(-200)).current;
  const toggleUp = () => setUp((prev) => !prev);
  const moveUp = () => {
    Animated.timing(Y_POSITION, {
      toValue: up ? 200 : -200,
      useNativeDriver: false,
      duration: 1000,
    }).start(toggleUp);
  };
  const rotation = Y_POSITION.interpolate({
    inputRange: [-200, 200],
    outputRange: ["-360deg", "360deg"],
  });
  const borderRadius = Y_POSITION.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });
  const bgColor = Y_POSITION.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255,99,71)", "rgb(71,166,255)"],
  });
  return (
    <Container>
      <AnimatedBox
        onPress={moveUp}
        style={{
          transform: [{ translateY: Y_POSITION }, { rotateY: rotation }],
          borderRadius,
          backgroundColor: bgColor,
        }}
      />
    </Container>
  );
}
