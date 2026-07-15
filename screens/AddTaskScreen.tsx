import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTaskStore } from "../stores/tasksStore";
import { formatDate } from "../utils";

export default function AddTaskScreen() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  const [isPickerVisible, setPickerVisibility] = useState(false);

  const showPicker = () => setPickerVisibility(true);
  const hidePicker = () => setPickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hidePicker();
  };

  const addTask = useTaskStore((state) => state.addTask);
  const handleAddBtn = () => {
    if (!title) {
      return;
    }
    if (!description) {
      return;
    }
    if (!date) {
      return;
    }

    addTask(title, description, date);
    navigation.navigate("Home");
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(t) => setTitle(t)}
        ></TextInput>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(t) => setDescription(t)}
        ></TextInput>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due date:</Text>
        <TouchableOpacity style={styles.input} onPress={showPicker}>
          <Text style={styles.dateText}>{formatDate(date.toISOString())}</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        locale="en"
      />

      <TouchableOpacity style={styles.btn} onPress={handleAddBtn}>
        <Text style={styles.btnText}>Add task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 5,
    width: "100%",
  },

  label: {
    fontWeight: "600",
    fontSize: 18,
  },

  input: {
    width: "auto",

    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",

    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },

  btn: {
    alignSelf: "center",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 15,
    width: "90%",
    padding: 10,
    backgroundColor: "#289efe",
    borderRadius: 10,
  },

  btnText: {
    color: "#efefef",
    fontWeight: "500",
    fontSize: 15,
  },
});
