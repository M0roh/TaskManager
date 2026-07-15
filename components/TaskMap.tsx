import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface TaskMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export default function TaskMap({
  latitude,
  longitude,
  address,
}: TaskMapProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hasCoordinates =
    latitude && longitude && latitude !== 0 && longitude !== 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color="#289efe" />
      </View>
    );
  }

  if (!isConnected || !hasCoordinates) {
    return (
      <View style={[styles.container, styles.offlineContainer]}>
        <Ionicons
          name={!isConnected ? "cloud-offline-outline" : "map-outline"}
          size={36}
          color="#9CA3AF"
        />
        <Text style={styles.offlineText}>
          {!isConnected
            ? "Map is unavailable offline"
            : "No coordinates for this task"}
        </Text>
        {address ? (
          <Text style={styles.addressText} numberOfLines={2}>
            {address}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude!,
          longitude: longitude!,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{ latitude: latitude!, longitude: longitude! }}
          title="Task Location"
          description={address}
          pinColor="#289efe"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  offlineContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  offlineText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  addressText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
  },
});
