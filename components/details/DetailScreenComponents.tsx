import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from "react-native";

interface HeaderProps {
  children: string;
}

export interface SubFields {
  title: string;
  content: string | number;
  name: string;
}
[];

export const Header = ({ children }: HeaderProps) => {
  return <Text style={{ fontSize: 16, fontWeight: "500" }}>{children}</Text>;
};

export const SubHeader = ({ children }: HeaderProps) => {
  return <Text style={{ fontSize: 12 }}>{children}</Text>;
};

export const CustomInput = (props: {
  children: string | number;
  name: string;
  handleChange: (name: string, value: string | number) => void;
}) => {
  return (
    <TextInput
      style={styles.input}
      onChangeText={(text: string) => props.handleChange(props.name, text)}
    >
      {props.children}
    </TextInput>
  );
};

export const renderDetailInputs = (
  fields: SubFields[],
  handleChange: (name: string, value: string | number) => void
) => {
  return fields.map((field, index) => (
    // While usually an anti-pattern, using index as a key here *should* be fine as our fields sent are static and will not be filtered or re-ordered
    <View key={index}>
      <SubHeader>{field.title}</SubHeader>
      <CustomInput handleChange={handleChange} name={field.name}>
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
