import { View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login, useMyContextController } from "../store";
import { useEffect, useState } from "react";
import GoogleLogin from "./GoogleLogin";

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Thêm trạng thái này để theo dõi khi người dùng nhấn nút đăng nhập

  const hasErrorEmail = () => submitted && !email.includes("@");
  const hasErrorPassword = () => submitted && password.length < 6;

  const handleLogin = () => {
    setSubmitted(true); // Đánh dấu rằng người dùng đã nhấn nút đăng nhập
    if (!hasErrorEmail() && !hasErrorPassword()) {
      login(dispatch, email, password);
    }
  };

  const handleGoogleLoginSuccess = () => {
    navigation.navigate("Customer");
  };

  useEffect(() => {
    console.log(userLogin);
    if (userLogin != null) {
      if (userLogin.role === "admin") navigation.navigate("Admin");
      else if (userLogin.role === "customer") navigation.navigate("Customer");
    }
  }, [userLogin]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          alignSelf: "center",
          color: "pink",
          marginTop: 100,
          marginBottom: 50,
        }}
      >
        Login
      </Text>
      <TextInput label={"Email"} value={email} onChangeText={setEmail} />
      <HelperText type="error" visible={hasErrorEmail()}>
        Địa chỉ Email không hợp lệ
      </HelperText>
      <TextInput
        label={"Password"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        right={
          <TextInput.Icon
            icon={"eye"}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Password ít nhất 6 kí tự
      </HelperText>
      <Button mode="contained" buttonColor="blue" onPress={handleLogin}>
        Login
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text>Don't have an account ? </Text>
        <Button onPress={() => navigation.navigate("Register")}>
          create new account
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("ForgotPassword")}>
          Forgot Password
        </Button>
      </View>
      <GoogleLogin onLoginSuccess={handleGoogleLoginSuccess} />
    </View>
  );
};

export default Login;
