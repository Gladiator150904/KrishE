import { useRef, useState } from "react";
import { View, TextInput } from "react-native";
import * as Clipboard from "expo-clipboard"; // Use expo-clipboard for clipboard handling

const OTPForm = ({ getOTP }) => {
  const refs = Array(6)
    .fill()
    .map(() => useRef(null));

  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleInputChange = (text, index) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = text;
    setOtp(updatedOTP);
    getOTP(updatedOTP.join(""));

    // Move to the next field if the input is valid
    if (text.length === 1 && refs[index + 1] && text !== "") {
      refs[index + 1].current.focus();
    }

    // Move to the previous field if the input is empty
    if (text === "" && refs[index - 1]) {
      refs[index - 1].current.focus();
    }
  };

  const handleFocus = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    if (clipboardContent.length === 6 && /^\d+$/.test(clipboardContent)) {
      const otpArray = clipboardContent.split("");
      setOtp(otpArray);
      getOTP(clipboardContent);

      // Automatically focus the last field
      refs[5].current?.focus();
      console.log("Pasted OTP: " + otpArray);
    }
  };

  return (
    <View className="flex-row gap-x-2 justify-center">
      {otp.map((digit, index) => (
        <View
          key={index}
          className="w-10 h-16 justify-center bg-white-text rounded-2xl border-2 border-white-borders focus:border-secondary flex flex-row items-center"
        >
          <TextInput
            className="flex-1 text-primary font-pmedium text-2xl text-center"
            ref={refs[index]}
            value={digit}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange(text, index)}
            onFocus={handleFocus} // Check clipboard content on focus
          />
        </View>
      ))}
    </View>
  );
};

export default OTPForm;
