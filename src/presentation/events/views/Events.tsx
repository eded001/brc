import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, Alert, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Edit, Trash } from "lucide-react-native";
import { auth } from "@libs/infrastructure/firebase/client";
import { Logger } from "../../../libs/infrastructure/logger/Logger";
import { Input } from "../../../shared/components/input/Input";
import { Button } from "../../../shared/components/button/Button";

interface Activity {
    id: string;
    person: string;
    task: string;
    datetime: Date;
}

export default function Events() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            setUserId(user?.uid || null);
            Logger.info('Events', 'User ID mudou', user?.uid);
        });
    }, []);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    // evento (range)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // atividades
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

    // modal
    const [modalVisible, setModalVisible] = useState(false);

    // edição atividade
    const [personName, setPersonName] = useState("");
    const [task, setTask] = useState("");
    const [activityDate, setActivityDate] = useState(new Date());
    const [activityTime, setActivityTime] = useState(new Date());

    const [showActivityDatePicker, setShowActivityDatePicker] = useState(false);
    const [showActivityTimePicker, setShowActivityTimePicker] = useState(false);

    const [height, setHeight] = useState(96);

    const MIN_HEIGHT = 0;   // equivalente ao h-24
    const MAX_HEIGHT = 180;  // limite estratégico

    const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const newHeight = event.nativeEvent.contentSize.height;

        const clampedHeight = Math.min(
            MAX_HEIGHT,
            Math.max(MIN_HEIGHT, newHeight)
        );

        // evita re-render desnecessário (estabilidade de UI)
        if (Math.abs(clampedHeight - height) > 2) {
            setHeight(clampedHeight);
        }
    };


    function generateId() {
        return Date.now().toString();
    }

    function mergeDateTime(date: Date, time: Date) {
        const d = new Date(date);
        d.setHours(time.getHours());
        d.setMinutes(time.getMinutes());
        return d;
    }

    function formatTime(date: Date) {
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function handleSave() {
        const start = mergeDateTime(startDate, startTime);
        const end = mergeDateTime(endDate, endTime);
        const activityDateTime = mergeDateTime(activityDate, activityTime);

        if (activityDateTime < start || activityDateTime > end) {
            Alert.alert("A atividade deve estar dentro do intervalo do evento");
            return;
        }

        const exists = activities.some(a => a.id === selectedActivityId);

        if (exists) {
            // update
            const updated = activities.map(item =>
                item.id === selectedActivityId
                    ? { ...item, person: personName, task, datetime: activityDateTime }
                    : item
            );
            setActivities(updated);
        } else {
            // create
            setActivities([
                ...activities,
                {
                    id: generateId(),
                    person: personName,
                    task,
                    datetime: activityDateTime
                }
            ]);
        }

        setModalVisible(false);
        setSelectedActivityId(null);
        setPersonName("");
        setTask("");
    }

    function buildEventPayload() {
        const start = mergeDateTime(startDate, startTime);
        const end = mergeDateTime(endDate, endTime);

        return {
            id: generateId(),

            userId: userId,

            title,
            description,
            location,

            startDateTime: start.toISOString(),
            endDateTime: end.toISOString(),

            createdAt: new Date().toISOString(),

            activities: activities.map(item => ({
                id: item.id,
                personName: item.person,
                role: item.task,
                dateTime: item.datetime.toISOString()
            }))
        };
    }

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <KeyboardAwareScrollView
                className="flex-1 px-5"
                enableOnAndroid
                extraScrollHeight={5}
                keyboardShouldPersistTaps="handled"
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <Input
                        label="TÍTULO"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Qual o nome do evento?"
                    />

                    <Input
                        label="DESCRIÇÃO"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Conte um pouco sobre o evento"
                        multiline
                        onContentSizeChange={handleContentSizeChange}
                        scrollEnabled={height >= MAX_HEIGHT}
                        style={{ height }}
                    />

                    {/* RANGE */}
                    <Text className="text-xs mb-2 text-muted">HORA</Text>

                    <View className="flex-row justify-between mb-4">

                        {/* INICIO */}
                        <View className="w-[48%]">
                            <Text className="text-xs mb-1 text-muted">Início</Text>

                            <Pressable
                                onPress={() => setShowStartDatePicker(true)}
                                className="bg-surface border border-borderSub rounded-xl px-3 py-3 mb-2"
                            >
                                <Text className="text-whiteSoft">
                                    {startDate.toLocaleDateString("pt-BR")}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setShowStartPicker(true)}
                                className="bg-surface border border-borderSub rounded-xl px-3 py-3"
                            >
                                <Text className="text-whiteSoft">
                                    {formatTime(startTime)}
                                </Text>
                            </Pressable>
                        </View>

                        {/* FIM */}
                        <View className="w-[48%]">
                            <Text className="text-xs mb-1 text-muted">Fim</Text>

                            <Pressable
                                onPress={() => setShowEndDatePicker(true)}
                                className="bg-surface border border-borderSub rounded-xl px-3 py-3 mb-2"
                            >
                                <Text className="text-whiteSoft">
                                    {new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setShowEndPicker(true)}
                                className="bg-surface border border-borderSub rounded-xl px-3 py-3"
                            >
                                <Text className="text-whiteSoft">
                                    {formatTime(endTime)}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* ATIVIDADES */}
                    <Text className="text-xs m-2 text-muted">ATIVIDADES</Text>

                    {activities.map((item) => {
                        const isSelected = selectedActivityId === item.id;

                        return (
                            <View
                                key={item.id}
                                className={`rounded-xl mb-2 border flex ${isSelected
                                    ? "bg-primary border-primary"
                                    : "bg-surface border-borderSub"
                                    }`}
                            >
                                {/* Conteúdo clicável (editar) */}
                                <Pressable
                                    onPress={() => {
                                        setSelectedActivityId(item.id);
                                        setPersonName(item.person);
                                        setTask(item.task);
                                        setActivityDate(new Date(item.datetime));
                                        setActivityTime(new Date(item.datetime));
                                        setModalVisible(true);
                                    }}
                                    className="px-4 py-3"
                                >
                                    <Text className={isSelected ? "text-bg font-bold" : "text-whiteSoft"}>
                                        {item.person} - {item.task}
                                    </Text>

                                    <Text className="text-xs text-muted mt-1">
                                        {item.datetime.toLocaleDateString("pt-BR")} às{" "}
                                        {formatTime(item.datetime)}
                                    </Text>
                                </Pressable>

                                {/* Ações */}
                                <View className="flex-row border-t border-borderSub">
                                    {/* Editar */}
                                    <Pressable
                                        onPress={() => {
                                            setSelectedActivityId(item.id);
                                            setPersonName(item.person);
                                            setTask(item.task);
                                            setActivityDate(new Date(item.datetime));
                                            setActivityTime(new Date(item.datetime));
                                            setModalVisible(true);
                                        }}
                                        className="flex-1 py-2 items-center"
                                    >
                                        {/* <Text className="text-primary text-xs font-semibold">
                                            Editar
                                        </Text> */}
                                        <Edit color="#00B37E" />
                                    </Pressable>

                                    {/* Remover */}
                                    <Pressable
                                        onPress={() => {
                                            const filtered = activities.filter(a => a.id !== item.id);
                                            setActivities(filtered);

                                            if (selectedActivityId === item.id) {
                                                setSelectedActivityId(null);
                                            }
                                        }}
                                        className="flex-1 py-2 items-center"
                                    >
                                        <Trash color="#F75A68" />
                                    </Pressable>

                                </View>
                            </View>
                        );
                    })}

                    <Pressable
                        onPress={() => {
                            setSelectedActivityId(null);
                            setPersonName("");
                            setTask("");
                            setActivityDate(new Date());
                            setActivityTime(new Date());
                            setModalVisible(true);
                        }}
                        className="bg-card border mb-2 border-borderSub h-10 rounded-lg items-center justify-center"
                    >
                        <Text className="text-whiteSoft text-lg">+</Text>
                    </Pressable>

                    {/* LOCAL */}
                    <Input
                        label="LOCAL"
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Onde será?"
                    />

                    {/* BOTÃO */}
                    <Button
                        title="Concluir"
                        onPress={() => {
                            const payload = buildEventPayload();
                            Logger.info('Events', 'Payload Final', payload);
                        }}
                        className="mb-10"
                    />
                </ScrollView>
            </KeyboardAwareScrollView>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View className="flex-1 bg-black/50 justify-center px-5">
                    <View className="bg-card rounded-2xl p-5">

                        <Text className="text-whiteSoft mb-2">Data</Text>
                        <Pressable
                            onPress={() => setShowActivityDatePicker(true)}
                            className="bg-surface border border-borderSub rounded-xl px-4 py-3 mb-3"
                        >
                            <Text className="text-whiteSoft">
                                {activityDate.toLocaleDateString("pt-BR")}
                            </Text>
                        </Pressable>

                        <Text className="text-whiteSoft mb-2">Hora</Text>
                        <Pressable
                            onPress={() => setShowActivityTimePicker(true)}
                            className="bg-surface border border-borderSub rounded-xl px-4 py-3 mb-4"
                        >
                            <Text className="text-whiteSoft">
                                {formatTime(activityTime)}
                            </Text>
                        </Pressable>

                        <Input
                            label="Nome"
                            value={personName}
                            onChangeText={setPersonName}
                            placeholder="Nome"
                        />

                        {["Organização", "Recepção", "Palestra"].map((label) => {
                            const isSelected = task === label;

                            return (
                                <Pressable
                                    key={label}
                                    onPress={() => setTask(label)}
                                    className={`rounded-xl p-3 mb-2 border ${isSelected
                                        ? "bg-primary border-primary"
                                        : "bg-surface border-borderSub"
                                        }`}
                                >
                                    <Text className={isSelected ? "text-bg font-bold" : "text-whiteSoft"}>
                                        {label}
                                    </Text>
                                </Pressable>
                            );
                        })}

                        <Button
                            title="Salvar"
                            onPress={handleSave}
                            className="mt-4"
                        />
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedActivityId(null);
                            }}
                            className="py-3 items-center mt-2"
                        >
                            <Text className="text-muted">Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* PICKERS */}
            {showStartDatePicker && (
                <DateTimePicker value={startDate} mode="date" onChange={(e, d) => {
                    setShowStartDatePicker(false);
                    if (d) setStartDate(d);
                }} />
            )}

            {showEndDatePicker && (
                <DateTimePicker value={endDate} mode="date" onChange={(e, d) => {
                    setShowEndDatePicker(false);
                    if (d) setEndDate(d);
                }} />
            )}

            {showStartPicker && (
                <DateTimePicker value={startTime} mode="time" onChange={(e, d) => {
                    setShowStartPicker(false);
                    if (d) setStartTime(d);
                }} />
            )}

            {showEndPicker && (
                <DateTimePicker value={endTime} mode="time" onChange={(e, d) => {
                    setShowEndPicker(false);
                    if (d) setEndTime(d);
                }} />
            )}

            {showActivityDatePicker && (
                <DateTimePicker
                    value={activityDate}
                    mode="date"
                    minimumDate={startDate}
                    maximumDate={endDate}
                    onChange={(e, d) => {
                        setShowActivityDatePicker(false);
                        if (d) setActivityDate(d);
                    }}
                />
            )}

            {showActivityTimePicker && (
                <DateTimePicker
                    value={activityTime}
                    mode="time"
                    onChange={(e, d) => {
                        setShowActivityTimePicker(false);
                        if (d) setActivityTime(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
}