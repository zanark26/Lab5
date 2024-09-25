import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useMyContextController } from "../store";
import { useNavigation } from '@react-navigation/native';
import { useEffect,useState } from 'react';

export default function GoogleLogin({onLoginSuccess}) {
    const [, dispatch] = useMyContextController();
    const provider = auth.GoogleAuthProvider;
    

    GoogleSignin.configure({
        webClientId:'981374694027-8t6bhc03tgj8gb228dsjk5ru4t2jvis5.apps.googleusercontent.com'
    });
    
    const onGoogleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            console.log("Google Play Services available");
            await GoogleSignin.signOut();

            // Chọn tài khoản Google
            const userInfo = await GoogleSignin.signIn();
            console.log("Google Sign-In successful", userInfo);
    
            if (!userInfo.data.idToken) {
                throw new Error("No ID token present!");
            }
    
            console.log("ID Token:", userInfo.data.idToken);
            
            const credential = provider.credential(
                userInfo.data.idToken,
                userInfo.data.accessToken
            );
            
            
            const userCredential = await auth().signInWithCredential(credential);
            console.log("Firebase auth successful", userCredential.user);
            onLoginSuccess();

            
            // Đăng nhập thành công, bạn có thể thực hiện các hành động tiếp theo ở đây
            
        } catch (error) {
            console.error("Google Sign-In error: ", error);
        }
    };
    

    return (
        <View>
            <Button mode="contained" onPress={onGoogleSignin}>
                Google Sign in
            </Button>
        </View>
    );
}