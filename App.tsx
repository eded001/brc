// App.tsx
import Auth from "@/components/Auth";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const { width } = Dimensions.get("window");

const SLIDES = [
  { id: "1", title: "Bem-vindo", description: "Organize suas ideias e avance com foco." },
  { id: "2", title: "Produtividade", description: "Fluxos simples, execução eficiente." },
  { id: "3", title: "Tudo pronto", description: "Vamos começar sua jornada." },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (!showOnboarding) {
    return (
      <View className="flex-1 bg-green-50">
        <Auth />
        <View className="pb-5 items-center">
          {session?.user && (
            <Text className="mt-4 text-green-900">Usuário: {session.user.id}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-green-50">
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-10">
            <Text className="text-3xl font-bold mb-3 text-green-900">{item.title}</Text>
            <Text className="text-base text-center text-green-700">{item.description}</Text>
          </View>
        )}
      />

      <View className="pb-10 items-center">
        <View className="flex-row mb-5">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 mx-1 rounded-full ${i === index ? "bg-green-900" : "bg-green-300"}`}
            />
          ))}
        </View>

        {index === SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={() => setShowOnboarding(false)}
            className="bg-green-900 px-8 py-3 rounded-md"
          >
            <Text className="text-white font-semibold text-base">Começar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}