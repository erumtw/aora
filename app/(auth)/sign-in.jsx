import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton"
import { Link } from "expo-router";
const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {}
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-xl text-semibold mt-5 font-psemibold text-white">
            Sign In
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(p) => setForm({ ...form, password: p })}
            otherStyles="mt-7"
          />

          <CustomButton title="Sign In" containerStyle="mt-7" handlePress={{submit}} isLoading={isSubmitting}/>
          
          <View className="justify-center pt-5 flex-row gap-2">
             <Text className="text-lg text-gray-100 font-pregular"> Don't have an account?</Text>
             <Link href="/sign-up" className="text-lg text-secondary font-psemibold">Sign Up</Link>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
