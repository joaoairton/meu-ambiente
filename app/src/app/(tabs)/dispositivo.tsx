
import { StyleSheet, Text, View } from 'react-native';

export default function DeviceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivo</Text>
      <Text style={styles.description}>
        Informações do ESP32 e do sensor DHT11.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },
});
