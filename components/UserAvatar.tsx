import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AxisUser,
  userInitials,
} from "../contexts/AuthContext";

type UserAvatarProps = {
  user: AxisUser | null;
  size?: number;
};

export default function UserAvatar({
  user,
  size = 64,
}: UserAvatarProps) {
  const initials = userInitials(user);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={
        user
          ? `Avatar de ${user.firstName} ${user.lastName}`
          : "Avatar de visitante"
      }
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor:
            user?.avatarColor ?? "#777777",
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.35,
          },
        ]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  initials: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});