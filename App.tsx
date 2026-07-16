import React from "react";

import { StyleSheet, Text, View } from "react-native";

import HomeScreen from "./screens/HomeScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HistoryScreen from "./screens/HistoryScreen";
import TaskDetailScreen from "./screens/TaskDetailsScreen";
import UpsertTaskScreen from "./screens/UpsertTaskScreen";

type RootStackParamList = {
  Home: undefined;
  UpsertTask: undefined;
  TaskDetails: { taskId: string };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.navigatorContainer}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "My tasks" }}
              />

              <Stack.Screen
                name="UpsertTask"
                component={UpsertTaskScreen}
                options={{ title: "Create task" }}
              />

              <Stack.Screen
                name="TaskDetails"
                component={TaskDetailScreen}
                options={{ title: "Task creating" }}
              />

              <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: "History" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <Text style={styles.footerText}>SA-RN-140720262330</Text>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navigatorContainer: {
    flex: 1,
  },

  footer: {
    display: "flex",
    alignSelf: "center",

    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 13,
    color: "#888888",
    fontWeight: "500",
  },
});
