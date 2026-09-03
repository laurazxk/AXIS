import React from "react";
import { Stack } from "expo-router";

export default function LogicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}