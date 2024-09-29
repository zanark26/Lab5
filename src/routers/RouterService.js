import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";
import { View, Alert, PermissionsAndroid, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';

const Stack = createStackNavigator();

const RouterService = () => {
    const [controller, updateController] = useMyContextController();
    const [userLoginState, setUserLoginState] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const unsubscribe = updateController((newController) => {
            if (newController.userLogin && newController.userLogin.id) {
                setUserLoginState(newController.userLogin);
                fetchAvatarFromFirestore(newController.userLogin.id);
                checkStoragePermission();
            } else {
                console.warn('User login information is incomplete');
            }
        });

        return () => unsubscribe();
    }, []);

    const checkStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Storage permission granted");
            } else {
                console.log("Storage permission denied");
                Alert.alert("Permission Denied", "Storage permission is required to select an image.");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchAvatarFromFirestore = async (userId) => {
        try {
            const doc = await firestore().collection('avatars').doc(userId).get();
            if (doc.exists) {
                const data = doc.data();
                if (data && data.avatarUrl) {
                    setAvatar({ uri: data.avatarUrl });
                }
            }
        } catch (error) {
            console.error('Error fetching avatar: ', error);
        }
    };

    const handleAvatarClick = () => {
        if (!userLoginState || !userLoginState.id || !userLoginState.name) {
            Alert.alert("Error", "User information not fully loaded. Please try again in a moment.");
            return;
        }

        const options = {
            title: 'Select Avatar',
            mediaType: 'photo',
            includeBase64: false,
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
                Alert.alert("Error", "Failed to open image picker. Please try again.");
            } else if (response.assets && response.assets.length > 0) {
                const source = { uri: response.assets[0].uri };
                setAvatar(source);
                uploadAvatarToFirebase(response.assets[0].uri);
            } else {
                console.warn('Unexpected response from image picker', response);
            }
        });
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission granted");
                const result = await ImagePicker.launchCamera({ mediaType: 'photo', cameraType: 'front' });
                if (result.assets && result.assets.length > 0) {
                    setAvatar({ uri: result.assets[0].uri });
                    uploadAvatarToFirebase(result.assets[0].uri);
                } else if (result.didCancel) {
                    console.log('User cancelled camera');
                } else if (result.error) {
                    console.error('Camera Error: ', result.error);
                    Alert.alert("Error", "Failed to open camera. Please try again.");
                }
            } else {
                console.log("Camera permission denied");
                Alert.alert("Permission Denied", "Camera permission is required to take a photo.");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const uploadAvatarToFirebase = async (uri) => {
        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting avatar upload...');
        console.log('User login state:', JSON.stringify(userLoginState, null, 2));

        if (!userLoginState || !userLoginState.id) {
            
            return;
        }

        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const storageRef = storage().ref(`avatars/${fileName}`);
        
        try {
            console.log('Uploading file to Firebase Storage...');
            await storageRef.putFile(uri);
            console.log('File uploaded successfully');

            console.log('Getting download URL...');
            const downloadURL = await storageRef.getDownloadURL();
            console.log('Download URL:', downloadURL);
            
            const avatarData = {
                avatarUrl: downloadURL,
                userId: userLoginState.id,
                userName: userLoginState.name,
                updatedAt: firestore.FieldValue.serverTimestamp()
            };

            console.log('Avatar data:', avatarData);

            // Detailed check for each required field
            if (!avatarData.avatarUrl) {
                throw new Error('Missing avatarUrl');
            }
            if (!avatarData.userId) {
                throw new Error('Missing userId');
            }
            if (!avatarData.userName) {
                throw new Error('Missing userName');
            }

            console.log('Saving avatar data to Firestore...');
            await firestore().collection('avatars').doc(userLoginState.id).set(avatarData);
            console.log('Avatar data saved successfully');

            setAvatar({ uri: downloadURL });
            Alert.alert("Success", "Avatar uploaded successfully!");
        } catch (error) {
            console.error('Error uploading avatar: ', error);
            Alert.alert("Error", `Failed to upload avatar: ${error.message}`);
        }
    };

    return (
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                title: (userLoginState != null) && userLoginState.name,
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: "pink",
                },
                headerRight: (props) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {avatar ? (
                            <Image
                                source={avatar}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    marginRight: 10,
                                    alignSelf: 'center', // Align the image vertically
                                }}
                            />
                        ) : (
                            <IconButton
                                icon="account"
                                size={40}
                                onPress={handleAvatarClick}
                            />
                        )}
                        <IconButton
                            icon="camera"
                            size={40}
                            onPress={requestCameraPermission}
                        />
                    </View>
                ),
            }}
        >
            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="AddNewService" component={AddNewService} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
        </Stack.Navigator>
    );
};

export default RouterService;