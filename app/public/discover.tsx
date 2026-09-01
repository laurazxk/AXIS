import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

export default function Discover() {
  return (
    <View style={styles.container}>
      <View style={styles.bottomCard}>
        <Text style={styles.title}>
          Descubra os melhores lugares
          ao redor do mundo
        </Text>

        <Text style={styles.description}>
          Planeje, organize e viva experiências
          inesquecíveis em grupo.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/public/plan')}
        >
          <Text style={styles.buttonText}>
            Começar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
  },

  bottomCard: {
    paddingHorizontal: 28,
    paddingBottom: 50,
    paddingTop: 30,
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
    marginBottom: 28,
  },

  button: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});