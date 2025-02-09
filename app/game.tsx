import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

export default function GameScreen() {
  return (
    <View style={styles.container}>
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}
      <EditScreenInfo path="app/game" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
