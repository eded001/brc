import React from 'react';
import { View, Text } from 'react-native';

const AVATAR_COLORS = [
    'bg-primary', 'bg-bright', 'bg-info', 'bg-warning', 'bg-success', 'bg-danger'
];

function avatarColorFor(uid: string) {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(id: string) {
    return id.slice(0, 2).toUpperCase();
}

interface AvatarProps {
    uid: string;
    sizeClassName?: string;
}

export function Avatar({ uid, sizeClassName = "w-9 h-9" }: AvatarProps) {
    const color = avatarColorFor(uid || "??");
    return (
        <View className={`${sizeClassName} ${color} rounded-full items-center justify-center`}>
            <Text className="text-bg text-xs font-bold">
                {initials(uid || "??")}
            </Text>
        </View>
    );
}
