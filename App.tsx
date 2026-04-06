import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { OnboardingModal } from "./components/OnboardingModal";
import { HeaderTitle } from "./components/HeaderTitle";
import { Product } from "./lib/ProductsContext";
import { ProductsProvider } from "./lib/ProductsContext";
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    AsyncStorage.getItem("onboarding_done").then((val) => {
      if (!val) setShowOnboarding(true);
    });
  }, []);

  const handleOnboardingDone = () => {
    AsyncStorage.setItem("onboarding_done", "1");
    setShowOnboarding(false);
  };

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <ProductsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTransparent: false,
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.text,
            headerTitleStyle: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
            contentStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerTitle: () => <HeaderTitle /> }}
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
            options={{ headerTitle: () => <HeaderTitle />, headerBackButtonDisplayMode: "minimal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </ProductsProvider>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      <OnboardingModal visible={showOnboarding} onDone={handleOnboardingDone} />
    </>
  );
}
