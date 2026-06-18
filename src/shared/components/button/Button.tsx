import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    className?: string;
    textClassName?: string;
}

export function Button({ title, variant = 'primary', loading, className = "", textClassName = "", disabled, ...props }: ButtonProps) {
    const baseStyle = "rounded-xl py-4 items-center justify-center flex-row";
    
    let variantStyle = "";
    let textStyle = "font-bold text-base";

    switch (variant) {
        case 'primary':
            variantStyle = disabled ? "bg-dim" : "bg-primary";
            textStyle += " text-bg";
            break;
        case 'secondary':
            variantStyle = "bg-surface";
            textStyle += " text-whiteSoft";
            break;
        case 'outline':
            variantStyle = "border border-borderSub bg-transparent";
            textStyle += " text-whiteSoft font-medium";
            break;
    }

    return (
        <Pressable 
            disabled={disabled || loading} 
            className={`${baseStyle} ${variantStyle} ${className}`} 
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? "#02130A" : "#00B37E"} />
            ) : (
                <Text className={`${textStyle} ${textClassName}`}>{title}</Text>
            )}
        </Pressable>
    );
}
