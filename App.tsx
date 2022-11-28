import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    Platform,
    View,
    Dimensions,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

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
