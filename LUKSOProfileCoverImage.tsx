import {ImageSourcePropType, StyleSheet, useWindowDimensions} from "react-native";
import {
    Blur,
    Canvas,
    Easing, Group, Image,
    interpolate,
    point, rect, rrect,
    runTiming,
    useImage,
    useValue,
    useValueEffect
} from "@shopify/react-native-skia";
import React from "react";
import {StatusBar} from "expo-status-bar";
import {DataSourceParam} from "@shopify/react-native-skia/src/skia/types/Data/Data";

interface LUKSOProfileCoverImageProps {
    onAnimationFinished?: () => void;

    profileCoverImageUrl: DataSourceParam;
    profileImageUrl: DataSourceParam;
}

export const LUKSOProfileCoverImage: React.FC<LUKSOProfileCoverImageProps> = ({
    onAnimationFinished,
    profileCoverImageUrl,
    profileImageUrl,
                                                                              }) => {
    const { width, height } = useWindowDimensions();
    const profileCoverImage = useImage(profileCoverImageUrl);
    const profileImage = useImage(profileImageUrl);
    const position = useValue(30);
    const profileImageScale = useValue(0);
    const profileCoverImageScale = useValue(1.5);
    const profileCoverImageWidth = useValue(width * 1.5);
    const profileCoverImageHeight = useValue(height * 1.5);
    const profileCoverImageX = useValue(width - (width * 1.5));
    const profileCoverImageY = useValue(height - (height * 1.5));
    const profileImageOpacity = useValue(1);
    const changePosition = () => {
        runTiming(position, 0, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        }, () => {
            console.log('animation is finished');
        });

        runTiming(profileCoverImageScale, 1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        });
    };

    const startProfileImageScaleOpacityOutAnimation = () => {
        runTiming(profileImageScale, 120 * 1.2, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        });
        runTiming(profileImageOpacity, 0, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        }, () => {
            onAnimationFinished && onAnimationFinished();
        });
    };

    const profileImageScaleAnimation = () => runTiming(profileImageScale, 120, {
        duration: 1700,
        easing: Easing.inOut(Easing.ease),
    }, () => {
        startProfileImageScaleOpacityOutAnimation();
    });

    const onCanvasLayout = React.useCallback(() => {
        changePosition();
        setTimeout(() => {
            profileImageScaleAnimation();
        }, 300);
    }, []);

    const r = 60;
    // const roundedRect = useValue(rrect(rect(padding, padding, profileImageScale.current - padding * 2, profileImageScale.current - padding * 2), r, r));
    const groupPoint = useValue(point(width / 2 - (profileImageScale.current / 2), height / 2 - (profileImageScale.current / 2)));
    const profileImageTransform = useValue([{
        scale: 0
    }]);
    const profileCoverImageTransform = useValue([{
        scale: 1.5
    }]);
    const imageX = useValue(width / 2 - 60);
    const imageY = useValue(height / 2 - 60);

    useValueEffect(profileImageScale, () => {
        // roundedRect.current = rrect(rect(0, 0, 120, 120), r, r);
        groupPoint.current = point(width / 2 - (profileImageScale.current / 2), height / 2 - (profileImageScale.current / 2));
        profileImageTransform.current = [{
            scale: interpolate(profileImageScale.current, [0, 120], [0, 1]),
        }];
        imageX.current = width / 2 - (profileImageScale.current / 2);
        imageY.current = height / 2 - (profileImageScale.current / 2);
    });

    useValueEffect(profileCoverImageScale, () => {
        profileCoverImageTransform.current = [{
            scale: interpolate(profileCoverImageScale.current, [1.5, 1], [1.5, 1]),
        }];
        console.log(width - (width * profileCoverImageScale.current));
        profileCoverImageWidth.current = width * profileCoverImageScale.current;
        profileCoverImageHeight.current = height * profileCoverImageScale.current;
        profileCoverImageX.current = width - (width * profileCoverImageScale.current);
        profileCoverImageY.current = height - (height * profileCoverImageScale.current);

    });


    if (!profileCoverImage || !profileImage) {
        return null;
    }

    return (
        <Canvas style={styles.container} onLayout={onCanvasLayout} >
            <StatusBar style="auto"/>
            <Image
                image={profileCoverImage}
                height={profileCoverImageHeight}
                width={profileCoverImageWidth}
                x={profileCoverImageX}
                y={profileCoverImageY}
                fit="cover"
            >
                <Blur blur={position} />
            </Image>
            <Group
                origin={groupPoint}
                clip={rrect(rect(0, 0, 120, 120), r, r)}
                transform={profileImageTransform}
            >
                <Image
                    x={imageX}
                    y={imageY}
                    image={profileImage}
                    height={120}
                    width={120}
                    opacity={profileImageOpacity}
                />
            </Group>
        </Canvas>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    profileImage: {
        borderRadius: 60,
    }
});
