import { Ref } from "react";
import {
  KeyboardType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  useWindowDimensions,
} from "react-native";

interface HeaderProps {
  children: string;
}

export interface SubFields {
  title: string;
  content: string | number;
  name: string;
  type?: KeyboardType;
  ref?: React.MutableRefObject<undefined>;
}
[];

export const Header = ({ children }: HeaderProps) => {
  return <Text style={{ fontSize: 20, fontWeight: "500" }}>{children}</Text>;
};

export const SubHeader = ({ children }: HeaderProps) => {
  return <Text style={{ fontSize: 16 }}>{children}</Text>;
};

export const CustomInput = (props: {
  children: string | number;
  name: string;
  handleChange?: (name: string, value: string | number, index?: number) => void;
  selectedIndex?: number;
  customStyle?: TextStyle;
  type?: KeyboardType;
}) => {
  return (
    <>
      {props.handleChange ? (
        <TextInput
          style={[styles.input, props.customStyle]}
          keyboardType={props.type ? props.type : "default"}
          selectTextOnFocus
          onChangeText={(text: string) =>
            props.selectedIndex
              ? props.handleChange?.(props.name, text, props.selectedIndex)
              : props.handleChange?.(props.name, text, 0)
          }
        >
          {props.children}
        </TextInput>
      ) : (
        <TextInput
          style={[styles.input, props.customStyle]}
          keyboardType={props.name === "quantity" ? "numeric" : "default"}
          selectTextOnFocus={true}
          editable={false}
        >
          {props.children}
        </TextInput>
      )}
    </>
  );
};

export const renderDetailInputs = (
  fields: SubFields[],
  handleChange: (name: string, value: string | number, index?: number) => void,
  selectedIndex?: number
) => {
  return fields.map((field, index) => (
    // While usually an anti-pattern, using index as a key here *should* be fine as our fields sent are static and will not be filtered or re-ordered
    <View key={index}>
      <SubHeader>{field.title}</SubHeader>
      <CustomInput
        handleChange={handleChange}
        name={field.name}
        selectedIndex={selectedIndex}
        type={field.type}
      >
        {field.content}
      </CustomInput>
    </View>
  ));
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingLeft: 12,
    marginHorizontal: 8,
    marginTop: 4,
  },
});
