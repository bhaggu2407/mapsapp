import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: "http://103.163.69.241/api/v1/tiles/styles/streets/?api_key=05a9e976c1764b2b92fe3ae8cfdd0e37&vector#10.75/18.9312/72.8209/0/21",
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
