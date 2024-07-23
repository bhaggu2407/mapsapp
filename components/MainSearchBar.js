import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";

const MainSearchBar = ({ searchQuery, setSearchQuery, onRoutingIconPress }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a location"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={onRoutingIconPress}
      >
        <Ionicons name="car-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    zIndex: 9999999,
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    zIndex: 999999,
  },
  iconContainer: {
    padding: 10,
  },
});

export default MainSearchBar;
