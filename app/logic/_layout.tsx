import React from "react";

import {
    Tabs,
} from "expo-router";


export default function TabsLayout() {

    return (

        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    display: "none",
                },
            }}
        >

            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />

            <Tabs.Screen
                name="trips"
                options={{
                    title: "Viagens",
                }}
            />

            <Tabs.Screen
                name="expenses"
                options={{
                    title: "Despesas",
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                }}
            />

        </Tabs>
    );
}