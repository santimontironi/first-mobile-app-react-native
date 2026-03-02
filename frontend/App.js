import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import AuthProvider from './src/context/AuthContext';
import TaskProvider from './src/context/TaskContext';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <View style={styles.container}>
          <AppNavigation />
          <StatusBar style="auto" />
        </View>
      </TaskProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
