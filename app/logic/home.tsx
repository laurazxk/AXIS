import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        AXIS
      </Text>

      <Text style={styles.subtitle}>
        Explorar destinos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});
