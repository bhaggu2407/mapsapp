import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "react-native-vector-icons";

const TransportationModeSelector = ({ setTransportationMode }) => {
  const modes = [
    {
      mode: "auto",
      icon: <Ionicons name="car-outline" size={24} color="white" />,
    },
    {
      mode: "pedestrian",
      icon: <FontAwesome5 name="walking" size={24} color="white" />,
    },
    {
      mode: "motorcycle",
      icon: <MaterialCommunityIcons name="motorbike" size={24} color="white" />,
    },
    {
      mode: "bus",
      icon: <Ionicons name="bus-outline" size={24} color="white" />,
    },
    {
      mode: "truck",
      icon: (
        <MaterialCommunityIcons name="truck-outline" size={24} color="white" />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {modes.map(({ mode, icon }) => (
        <TouchableOpacity
          key={mode}
          style={styles.button}
          onPress={() => setTransportationMode(mode)}
        >
          {icon}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TransportationModeSelector;
