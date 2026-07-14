import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View></View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SA-RN-140720262330</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",

    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    display: "flex",

    justifyContent: "center",
    alignContent: "center",

    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 12,
    color: "#888888",
  },
});
