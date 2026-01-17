import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Circle, RefreshCcw } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

export default function VideoVerification() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const { nin, idImage } = params;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Web File Picker
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 10,
        });
        if (video) {
          setVideoUri(video.uri);
        }
        setIsRecording(false);
      } catch (e) {
        console.error(e);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setVideoUri(null);
  };

  const handleSubmit = async () => {
    if (!videoUri || !nin || !idImage) {
      Alert.alert("Error", "Missing data. Please restart verification.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('nin_bvn', nin as string);

      const idUri = decodeURIComponent(idImage as string);
      const idFilename = idUri.split('/').pop() || 'id_card.jpg';

      if (Platform.OS === 'web') {
        const idBlob = await fetch(idUri).then(r => r.blob());
        formData.append('id_document', idBlob, idFilename);

        const videoBlob = await fetch(videoUri).then(r => r.blob());
        formData.append('live_video', videoBlob, 'verification.mp4');

        // Use ID blob for dummy selfie too
        formData.append('live_photo', idBlob, 'selfie.jpg');
      } else {
        // Native React Native fetch handles this object structure
        // @ts-ignore
        formData.append('id_document', {
          uri: idUri,
          name: idFilename,
          type: 'image/jpeg',
        });

        const videoFilename = videoUri.split('/').pop() || 'verification.mp4';
        // @ts-ignore
        formData.append('live_video', {
          uri: videoUri,
          name: videoFilename,
          type: 'video/mp4',
        });

        // @ts-ignore
        formData.append('live_photo', {
          uri: idUri,
          name: 'selfie.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch(`${BASE_URL}/verification/submit-identity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        if (Platform.OS === 'web') {
          window.alert("Success: Verification Submitted!");
        } else {
          Alert.alert("Success", "Verification Submitted! Pending Admin Approval.");
        }
        router.replace('/(tabs)');
      } else {
        const msg = result.message || "Something went wrong";
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert("Upload Failed", msg);
      }

    } catch (error: any) {
      if (Platform.OS === 'web') window.alert(error.message);
      else Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Web Render
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/verify/identity')} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <View style={styles.webContainer}>
          <Text style={[styles.title, { color: 'white' }]}>Upload Video</Text>
          <Text style={styles.instruction}>Camera recording is not supported in the browser. Please upload a pre-recorded video.</Text>

          {!videoUri ? (
            <Button title="Select Video" onPress={pickVideo} />
          ) : (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <CheckCircle size={50} color={Colors.success} style={{ marginBottom: 10 }} />
              <Text style={{ color: 'white', marginBottom: 20 }}>Video Selected</Text>
              <Button title={uploading ? "Uploading..." : "Submit Verification"} onPress={handleSubmit} />
              <TouchableOpacity onPress={handleRetake} style={{ marginTop: 20 }}>
                <Text style={{ color: Colors.textSecondary }}>Choose Different Video</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Mobile Permissions
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', margin: 20, color: 'white' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Mobile Render
  return (
    <View style={styles.container}>
      {!videoUri ? (
        <>
          <CameraView
            style={styles.camera}
            facing="front"
            mode="video"
            ref={cameraRef}
          />
          {/* Absolute Overlay Controls - Fixes Children Error */}
          <View style={styles.controlsOverlay}>
            <Text style={styles.instruction}>Record a short video (Max 10s)</Text>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recording]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Circle size={60} color="red" fill={isRecording ? "red" : "transparent"} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.title}>Video Recorded!</Text>
          <CheckCircle size={80} color={Colors.primary} style={{ marginBottom: 20 }} />

          <Button title={uploading ? "Submitting..." : "Submit Verification"} onPress={handleSubmit} style={styles.previewButton} />
          {!uploading && (
            <TouchableOpacity onPress={handleRetake} style={styles.retakeBtn}>
              <RefreshCcw size={20} color={Colors.textSecondary} />
              <Text style={styles.retakeText}>Retake Video</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/verify/identity')} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  instruction: {
    color: 'white',
    marginBottom: 20,
    fontSize: 16,
  },
  recordButton: {
    marginBottom: 10,
  },
  recording: {
    opacity: 0.8,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  previewButton: {
    marginBottom: 10,
    width: '100%',
  },
  retakeBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retakeText: {
    color: Colors.textSecondary,
    fontSize: 16,
  }
});
