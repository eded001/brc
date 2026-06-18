import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
    containerClassName?: string;
}

export function Input({ label, icon, error, containerClassName = "", ...props }: InputProps) {
    return (
        <View className={`mb-4 ${containerClassName}`}>
            {label && <Text className="text-xs text-muted mb-1">{label}</Text>}
            <View className={`flex-row items-center bg-card rounded-xl px-4 py-1 border ${error ? "border-danger" : "border-borderSub"}`}>
                <TextInput
                    className="flex-1 text-whiteSoft min-h-[48px]"
                    placeholderTextColor="#7F8F85"
                    {...props}
                />
                {icon && <View className="ml-2">{icon}</View>}
            </View>
            {error && <Text className="text-danger mt-1 text-xs">{error}</Text>}
        </View>
    );
}
