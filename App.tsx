import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import React from "react";
import {LUKSOProfileCoverImage} from "./LUKSOProfileCoverImage";
import LUKSOQRCode from "./LUKSOQRCode";

export default function App() {
    const qrCodeData = "https://docs.lukso.tech/standards/generic-standards/lsp1-universal-receiver-delegate";
    const [showQRCode, setShowQRCode] = React.useState(false);
    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <LUKSOProfileCoverImage
                profileCoverImageUrl={require('./assets/profile_image_cover.jpg')}
                profileImageUrl={require('./assets/profile_image.png')}
                onAnimationFinished={() => {
                    setTimeout(() => {
                        setShowQRCode(true);
                    }, 1000);
                }
                }
            />

            {showQRCode && (<LUKSOQRCode
                data={qrCodeData}
                size={200}
                logo={require('./assets/lukso_qr_logo.png')}
                logoSize={44}
                logoPadding={10}
            />)}
            {/*<Text>Open up App.tsx to start working on your app!</Text>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
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
