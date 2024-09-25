import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const hasErrorEmail = () => !email.includes('@');

    const handleResetPassword = async () => {
        if (hasErrorEmail()) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        try {
            await auth().sendPasswordResetEmail(email);
            setSuccessMessage('Link đặt lại mật khẩu đã được gửi đến email của bạn.');
            setError('');
        } catch (error) {
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
            setSuccessMessage('');
            console.error('Error sending password reset email: ', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold',
                alignSelf: 'center',
                color: 'blue',
                marginTop: 100,
                marginBottom: 50
            }}>Forgot Password</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <HelperText type="error" visible={hasErrorEmail()}>
                Địa chỉ Email không hợp lệ
            </HelperText>

            {error ? <HelperText type="error">{error}</HelperText> : null}
            {successMessage ? <HelperText type="info">{successMessage}</HelperText> : null}

            <Button mode="contained" onPress={handleResetPassword}>
                Reset Password
            </Button>

            <Button onPress={() => navigation.goBack()}>
                Back to Login
            </Button>
        </View>
    );
};

export default ForgotPassword;
