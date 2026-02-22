import ChangeTheme from '@screens/debug/components/ChangeTheme';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function Redux() {
    return (
        <Provider store={store}>
            <ChangeTheme />
        </Provider>
    );
}