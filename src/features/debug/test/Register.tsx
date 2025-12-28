import React, { useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { User, Mail, Lock } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function RegisterSlides() {
    const navigation = useNavigation<any>();
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    // Campos do cadastro
    const [fullName, setFullName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validação
    const validateSlide = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (index === 0) {
            if (!fullName.trim()) newErrors.fullName = "Informe seu nome completo";
            if (!nickname.trim()) newErrors.nickname = "Informe um apelido";
        } else if (index === 1) {
            if (!email.trim()) newErrors.email = "Informe seu email";
            else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";
            if (!password) newErrors.password = "Informe sua senha";
            else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateSlide()) return;
        if (index < slides.length - 1) {
            listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            setIndex(index + 1);
        } else {
            // Último slide: navega para AppTabs
            navigation.replace("AppTabs");
        }
    };

    const slides = [
        {
            id: "1",
            render: () => (
                <View style={{ width, padding: 20, flex: 1, justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Dados Pessoais</Text>

                    <Text style={{ color: "white", marginTop: 20 }}>Nome completo</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0F2923", borderRadius: 12, padding: 10, marginTop: 5 }}>
                        <TextInput
                            style={{ flex: 1, color: "white" }}
                            placeholder="Digite seu nome completo"
                            placeholderTextColor="#7F8F85"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <User size={20} color="#00E887" />
                    </View>
                    {errors.fullName && <Text style={{ color: "red" }}>{errors.fullName}</Text>}

                    <Text style={{ color: "white", marginTop: 20 }}>Apelido</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0F2923", borderRadius: 12, padding: 10, marginTop: 5 }}>
                        <TextInput
                            style={{ flex: 1, color: "white" }}
                            placeholder="Ex: joao_dev"
                            placeholderTextColor="#7F8F85"
                            value={nickname}
                            onChangeText={setNickname}
                        />
                        <User size={20} color="#00E887" />
                    </View>
                    {errors.nickname && <Text style={{ color: "red" }}>{errors.nickname}</Text>}
                </View>
            ),
        },
        {
            id: "2",
            render: () => (
                <View style={{ width, padding: 20, flex: 1, justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Login</Text>

                    <Text style={{ color: "white", marginTop: 20 }}>Email</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0F2923", borderRadius: 12, padding: 10, marginTop: 5 }}>
                        <TextInput
                            style={{ flex: 1, color: "white" }}
                            placeholder="Digite seu email"
                            placeholderTextColor="#7F8F85"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Mail size={20} color="#00E887" />
                    </View>
                    {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}

                    <Text style={{ color: "white", marginTop: 20 }}>Senha</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0F2923", borderRadius: 12, padding: 10, marginTop: 5 }}>
                        <TextInput
                            style={{ flex: 1, color: "white" }}
                            placeholder="Mínimo 6 caracteres"
                            placeholderTextColor="#7F8F85"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Lock size={20} color="#00E887" />
                    </View>
                    {errors.password && <Text style={{ color: "red" }}>{errors.password}</Text>}
                </View>
            ),
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#02130A" }}>
            <FlatList
                ref={listRef}
                data={slides}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <View style={{ width }}>{item.render()}</View>}
            />

            <View style={{ padding: 20, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={handleNext}
                    style={{ backgroundColor: "#00B37E", padding: 15, borderRadius: 12, width: "80%", alignItems: "center" }}
                >
                    <Text style={{ color: "#0B1914", fontWeight: "bold", fontSize: 16 }}>
                        {index === slides.length - 1 ? "Finalizar" : "Próximo"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}