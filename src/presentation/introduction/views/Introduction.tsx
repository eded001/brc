import React from 'react';
import { View } from 'react-native';

// components
import { Onboarding } from '@/components/onboarding';

// types
import { GoToScreenProps } from '@/constants/types/go-to-screen';
import { SlidesProps } from '@/components/onboarding/types/slides';

const SLIDES: SlidesProps[] = [
  {
    id: '1',
    title: 'Bem-vindo',
    description: 'Organize suas ideias e avance com foco.',
  },
  {
    id: '2',
    title: 'Produtividade',
    description: 'Fluxos simples, execução eficiente.',
  },
  { id: '3', title: 'Tudo pronto', description: 'Vamos começar sua jornada.' },
];

export default function Introduction({ onFinish }: GoToScreenProps) {
  return (
    <View className="flex-1 bg-green-50">
      <Onboarding
        slides={SLIDES}
        onFinish={onFinish}
        activeDotColor="#16A34A"
        inactiveDotColor="#A7F3D0"
        buttonText="Vamos lá"
        allowSwipe={true}
      />
    </View>
  );
}