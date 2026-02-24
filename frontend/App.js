import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AppNavigation } from './src/navigation';
import AuthProvider from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <AppNavigation />
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
