import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";

const FormField1 = ({
  title,
  value,
  maxLength,
  minLength,
  height='h-16',
  handleChangeText,
  background_colour,
  border_colour,
  text_colour,
  otherStyles,
  keyboardType,
  multiline=false,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base ${text_colour} font-psemibold`}>{title}</Text>

      <View className={`w-full ${height} px-4 ${background_colour} rounded-2xl border-2 ${border_colour} focus:border-secondary flex flex-row `}>
        <TextInput
          className={`flex-1 ${text_colour} font-pmedium text-lg`}
          maxLength={maxLength}
          value={value}
          onChangeText={handleChangeText}
          multiline={multiline}
          {...props}
          keyboardType={keyboardType}
          style={{
            ...(multiline&& {textAlignVertical:'top'})
          }}
        />
      </View>
    </View>
  );
};

export default FormField1;
