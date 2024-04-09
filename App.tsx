import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  Delegate,
  MediapipeCamera,
  RunningMode,
  useObjectDetection,
} from 'react-native-mediapipe';
import {useCameraPermission} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const cameraPermission = useCameraPermission();
  const [categories, setCategories] = React.useState<string>();
  const frameProcessor = useObjectDetection(
    results => {
      console.log('Detection results:', results);
      setCategories(
        results.results
          .map(result =>
            result.detections
              .map(d => d.categories.map(c => c.categoryName).join(', '))
              .join(', '),
          )
          .join(', '),
      );
      console.log('Detection results:', results);
    },

    error => {
      console.error(`onError: ${error}`);
    },
    RunningMode.LIVE_STREAM,
    'efficientdet-lite0.tflite',
    {delegate: Delegate.GPU},
  );

  return (
    <SafeAreaView style={styles.root}>
      {cameraPermission.hasPermission ? (
        <View style={styles.container}>
          <MediapipeCamera style={styles.camera} processor={frameProcessor} />
          <Text style={styles.categoriesText}>{categories}</Text>
          <Text style={styles.categoriesText}> running into bugs</Text>
        </View>
      ) : (
        <RequestPermissions
          hasCameraPermission={cameraPermission.hasPermission}
          requestCameraPermission={cameraPermission.requestPermission}
        />
      )}
    </SafeAreaView>
  );
}

const RequestPermissions: React.FC<{
  hasCameraPermission: boolean;
  requestCameraPermission: () => Promise<boolean>;
}> = ({hasCameraPermission, requestCameraPermission}) => {
  console.log(hasCameraPermission);
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Mediapipe</Text>
      <View style={styles.permissionsContainer}>
        {!hasCameraPermission && (
          <Text style={styles.permissionText}>
            React Native Mediapipe needs{' '}
            <Text style={styles.bold}>Camera permission</Text>.{' '}
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  welcome: {color: 'black', fontSize: 38, fontWeight: 'bold', maxWidth: '80%'},
  banner: {
    position: 'absolute',
    opacity: 0.4,
    bottom: 0,
    left: 0,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  categoriesText: {color: 'black', fontSize: 36},
  permissionsContainer: {
    marginTop: 30,
  },
  permissionText: {
    color: 'black',
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default App;
