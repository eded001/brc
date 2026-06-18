import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../../shared/components/input/Input";
import { Button } from "../../../shared/components/button/Button";
import { RootStackNavigationProp } from "../../../../app/navigation/types";
import { User, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const TAGS_INTERESTS = [
    "Tecnologia", "Música", "Esportes", "Arte",
    "Games", "Inteligência Artificial", "Machine Learning", "Data Science",
    "Blockchain", "Criptomoedas", "IoT", "Realidade Virtual",
    "Realidade Aumentada", "Cibersegurança", "DevOps",
    "Cloud Computing", "Mobile", "Web", "Robótica",
    "Automação", "Fintech", "Startups"
];

const TAGS_SKILLS = [
    "JavaScript", "TypeScript", "React", "React Native",
    "Next.js", "Node.js", "Express", "NestJS",
    "Python", "Django", "Flask", "Java",
    "Spring Boot", "Kotlin", "Swift", "Objective-C",
    "C#", ".NET", "Go", "Rust",
    "C++", "C", "PHP", "Laravel",
    "Ruby", "Rails", "SQL", "PostgreSQL",
    "MySQL", "MongoDB", "GraphQL", "REST",
    "Docker", "Kubernetes", "AWS", "Azure",
    "GCP", "Firebase", "Tailwind CSS", "Sass",
    "Bootstrap", "UI/UX Design", "Testing", "Jest",
    "Cypress", "Automation", "CI/CD", "Microservices",
    "Event-Driven Architecture", "Serverless", "WebAssembly"
];

export default function Register() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    // cadastro
    const [fullName, setFullName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // tags
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const toggleInterest = (tag: string) => {
        setSelectedInterests(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const toggleSkill = (tag: string) => {
        setSelectedSkills(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

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
            navigation.replace("AppTabs");
        }
    };

    const slides = [
        {
            id: 1,
            render: () => (
                <SafeAreaView className="w-full px-5 mt-10 flex-1 justify-start">
                    <Text className="text-white text-2xl font-bold">Dados Pessoais</Text>

                    <Input
                        label="Nome completo"
                        placeholder="Digite seu nome completo"
                        value={fullName}
                        onChangeText={setFullName}
                        error={errors.fullName}
                        icon={<User size={20} color="#00E887" />}
                    />

                    <Input
                        label="Apelido"
                        placeholder="Ex: joao_dev"
                        value={nickname}
                        onChangeText={setNickname}
                        error={errors.nickname}
                        icon={<User size={20} color="#00E887" />}
                    />
                </SafeAreaView>
            ),
        },
        {
            id: 2,
            render: () => (
                <SafeAreaView className="w-full px-5 my-10 flex-1 justify-start">
                    <Text className="text-white text-2xl font-bold">Login</Text>

                    <Input
                        label="Email"
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                        icon={<Mail size={20} color="#00E887" />}
                    />

                    <Input
                        label="Senha"
                        placeholder="Mínimo 6 caracteres"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                        icon={<Lock size={20} color="#00E887" />}
                    />
                </SafeAreaView>
            ),
        },
        {
            id: 3,
            render: () => (
                <SafeAreaView className="flex-1 px-5">
                    <ScrollView showsVerticalScrollIndicator>
                        <Text className="text-white text-2xl font-bold mb-5">
                            Mostre suas habilidades
                        </Text>

                        <View className="flex-row flex-wrap">
                            {TAGS_SKILLS.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => toggleSkill(tag)}
                                    className={`px-4 py-2 mr-2 mb-2 rounded-full border ${selectedSkills.includes(tag)
                                        ? "bg-[#00B37E] border-[#00B37E]"
                                        : "border-gray-600"
                                        }`}
                                >
                                    <Text className={`text-white ${selectedSkills.includes(tag) ? "font-bold" : "font-normal"}`}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            ),
        },
        {
            id: 4,
            render: () => (
                <SafeAreaView className="flex-1 px-5">
                    <ScrollView showsVerticalScrollIndicator>
                        <Text className="text-white text-2xl font-bold mb-5">
                            Mostre seus interesses
                        </Text>

                        <View className="flex-row flex-wrap">
                            {TAGS_INTERESTS.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => toggleInterest(tag)}
                                    className={`px-4 py-2 mr-2 mb-2 rounded-full border ${selectedInterests.includes(tag)
                                        ? "bg-[#00B37E] border-[#00B37E]"
                                        : "border-gray-600"
                                        }`}
                                >
                                    <Text className={`text-white ${selectedInterests.includes(tag) ? "font-bold" : "font-normal"}`}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            ),
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#02130A]">
            <FlatList
                ref={listRef}
                data={slides}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <View style={{ width }}>{item.render()}</View>}
            />

            <View className="p-5 flex-row justify-between items-center">
                <Button
                    title="Voltar"
                    variant="outline"
                    onPress={() => {
                        if (index > 0) {
                            listRef.current?.scrollToIndex({ index: index - 1, animated: true });
                            setIndex(index - 1);
                        }
                    }}
                    disabled={index === 0}
                    className="flex-1 mr-2"
                />

                <Button
                    title={index === slides.length - 1 ? "Finalizar" : "Próximo"}
                    onPress={handleNext}
                    className="flex-1 ml-2"
                />
            </View>
        </SafeAreaView>
    );
}