import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTaskStore } from "../stores/tasksStore";
import Location from "../types/location";
import { formatDate, getCoordinatesFromAddress } from "../utils";

export default function AddTaskScreen() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [address, setAddress] = useState<string>("");

  const [isPickerVisible, setPickerVisibility] = useState(false);
  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    address.trim().length > 0;

  const showPicker = () => setPickerVisibility(true);
  const hidePicker = () => setPickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hidePicker();
  };

  const addTask = useTaskStore((state) => state.addTask);
  const handleAddBtn = async () => {
    if (!isFormValid) return;

    let taskLocation: Location;

    if (address.trim().length > 0) {
      const geoData = await getCoordinatesFromAddress(address);

      if (geoData) {
        taskLocation = {
          address: geoData.address,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
      } else {
        taskLocation = {
          address: address,
        };
      }

      addTask(title, description, date, taskLocation);
      navigation.navigate("Home");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.screenTitle}>New Task</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add some details about this task..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={showPicker}>
              <Ionicons name="calendar-outline" size={20} color="#4B5563" />
              <Text style={styles.dateText}>
                {formatDate(date.toISOString())}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Location address</Text>
            <TextInput
              style={styles.input}
              placeholder="Where should this task be done?"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="datetime"
            date={date}
            onConfirm={handleConfirm}
            onCancel={hidePicker}
            locale="en"
          />

          <TouchableOpacity
            style={[styles.btn, !isFormValid && styles.btnDisabled]}
            onPress={handleAddBtn}
            disabled={!isFormValid}
          >
            <Text style={styles.btnText}>Create Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  row: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#111827",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  btn: {
    width: "100%",
    backgroundColor: "#289efe",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#289efe",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  btnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
