import React, { useEffect } from "react";

import {
    View,
    Image,
    StyleSheet,
    Text,
    StatusBar,
} from "react-native";

import { router } from "expo-router";


export default function SplashScreen() {

    useEffect(() => {

        const timer = setTimeout(() => {

            router.replace("/public/discover");

        }, 3000);

        return () => clearTimeout(timer);

    }, []);


    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
            />

            <View style={styles.logoContainer}>

                <Image
                    source={require("../assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.axis}>
                    AXIS
                </Text>

            </View>


            <Text style={styles.footer}>
                Planeje viagens com quem importa
            </Text>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#ffffff",

        alignItems: "center",

        justifyContent: "center",

    },


    logoContainer: {

        alignItems: "center",

        justifyContent: "center",

    },


    logo: {

        width: 180,

        height: 180,

    },


    axis: {

        marginTop: -25,

        fontSize: 18,

        fontWeight: "800",

        letterSpacing: 6,

        color: "#111111",

    },


    footer: {

        position: "absolute",

        bottom: 40,

        fontSize: 12,

        color: "#777777",

    },

});