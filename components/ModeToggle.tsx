import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plane, Briefcase } from 'lucide-react-native';
import { useMode } from '@/contexts/ModeContext';
import { Colors } from '@/constants/Colors';

export default function ModeToggle() {
  const { mode, toggleMode } = useMode();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleMode}
      activeOpacity={0.7}
    >
      <View style={styles.modeInfo}>
        {mode === 'traveler' ? (
          <Plane size={20} color={Colors.primary} />
        ) : (
          <Briefcase size={20} color={Colors.secondary} />
        )}
        <Text style={styles.modeText}>
          {mode === 'traveler' ? 'Traveler Mode' : 'Business Mode'}
        </Text>
      </View>
      <Text style={styles.switchText}>Switch</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
