import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

export default function PlanFour() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/planeje 4.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <View style={styles.textGroup}>
        <Text style={styles.title}>
          Menos preocupação, mais viagem!
        </Text>

        <Text style={styles.description}>
          O Axis ajuda seu grupo a organizar tudo
          antes e durante a aventura.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/logic/home')}
      >
        <Text style={styles.arrow}>➜</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
  },

  illustration: {
    width: '100%',
    height: 350,
    marginTop: 30,
  },

  textGroup: {
    width: '100%',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 14,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    alignSelf: 'flex-end',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 25,
  },
});