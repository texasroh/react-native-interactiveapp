import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  View,
  Dimensions,
  Easing,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`;

const Word = styled.Text<{ color: string }>`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  z-index: 10;
`;

export default function App() {
  // Values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, -SCREEN_HEIGHT / 7],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [SCREEN_HEIGHT / 7, SCREEN_HEIGHT / 2],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });

  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 50,
    useNativeDriver: true,
    easing: Easing.linear,
  });

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -SCREEN_HEIGHT / 4 || dy > SCREEN_HEIGHT / 4) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              duration: 50,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
    })
  ).current;

  // State
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GREY} size={75} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}

/*

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
    background-color: white;
    width: 200px;
    height: 200px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    position: absolute;
`;

const Btn = styled.TouchableOpacity`
    margin: 0px 10px;
`;

const BtnContainer = styled.View`
    flex-direction: row;
    flex: 1;
`;

const CardContainer = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
`;

export default function App() {
    const scale = useRef(new Animated.Value(1)).current;
    const position = useRef(new Animated.Value(0)).current;
    const rotation = position.interpolate({
        inputRange: [-400, 400],
        outputRange: ["-300deg", "300deg"],
    });
    const secondScale = position.interpolate({
        inputRange: [-300, 0, 300],
        outputRange: [1, 0.5, 1],
        extrapolate: "clamp",
    });
    const onPressIn = Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
    });
    const onPressOut = Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
    });

    const goCenter = Animated.spring(position, {
        toValue: 0,
        useNativeDriver: true,
    });

    const goLeft = Animated.spring(position, {
        toValue: -500,
        useNativeDriver: true,
        tension: 5,
        restSpeedThreshold: 300,
        restDisplacementThreshold: 300,
    });

    const goRight = Animated.spring(position, {
        toValue: 500,
        useNativeDriver: true,
        tension: 5,
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => onPressIn.start(),
            onPanResponderRelease: (_, { dx }) => {
                if (dx < -SCREEN_WIDTH / 3) {
                    goLeft.start(onDismiss);
                } else if (dx > SCREEN_WIDTH / 3) {
                    goRight.start(onDismiss);
                } else {
                    Animated.parallel([onPressOut, goCenter]).start();
                }
            },
            onPanResponderMove: (_, { dx }) => {
                position.setValue(dx);
            },
        })
    ).current;

    const [index, setIndex] = useState(0);
    const onDismiss = () => {
        scale.setValue(1);
        position.setValue(0);
        setIndex((prev) => prev + 1);
    };

    const closePress = () => {
        goLeft.start(onDismiss);
    };
    const checkPress = () => {
        goRight.start(onDismiss);
    };
    return (
        <Container>
            <StatusBar style="light" />
            <CardContainer>
                <Card style={{ transform: [{ scale: secondScale }] }}>
                    <Ionicons
                        name={icons[index + 1]}
                        color="#192a56"
                        size={98}
                    />
                </Card>
                <Card
                    {...panResponder.panHandlers}
                    style={{
                        transform: [
                            { scale },
                            { translateX: position },
                            { rotate: rotation },
                        ],
                    }}
                >
                    <Ionicons name={icons[index]} color="#192a56" size={98} />
                </Card>
            </CardContainer>
            <BtnContainer>
                <Btn onPress={closePress}>
                    <Ionicons name="close-circle" color="white" size={58} />
                </Btn>
                <Btn onPress={checkPress}>
                    <Ionicons name="checkmark-circle" color="white" size={58} />
                </Btn>
            </BtnContainer>
        </Container>
    );
}
*/
