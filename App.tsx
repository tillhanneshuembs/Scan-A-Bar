import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import HomeScreen from "./screens/HomeScreen";
import ScannerScreen from "./screens/ScannerScreen";
import ResultScreen from "./screens/ResultScreen";
import RankingScreen from "./screens/RankingScreen";
import { AnimatedSplash } from "./components/AnimatedSplash";
import { Product } from "./lib/findProduct";
import { Colors, Fonts } from "./lib/theme";

export type RankType = "gesamt" | "naehrwert" | "geschmack" | "preis";

export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Result: { product: Product };
  Ranking: { rankType: RankType; highlightEan: string };
};

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black,
  });
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerBlurEffect: "systemUltraThinMaterialLight",
            headerTintColor: Colors.text,
            headerTitleStyle: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
            contentStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Scan-A-Bar" }}
          />
          <Stack.Screen
            name="Ranking"
            component={RankingScreen}
            options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ title: "Scannen", headerBackButtonDisplayMode: "minimal" }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
    </>
  );
}
