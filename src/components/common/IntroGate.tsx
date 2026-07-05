import React, { useState } from 'react';
import LogoIntroSplash from './LogoIntroSplash';

const SESSION_KEY = 'styler_intro_shown';

const IntroGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showIntro, setShowIntro] = useState(() => {
        try {
            return sessionStorage.getItem(SESSION_KEY) !== '1';
        } catch {
            return false;
        }
    });

    const handleComplete = () => {
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode / storage disabled */ }
        setShowIntro(false);
    };

    return (
        <>
            {showIntro && <LogoIntroSplash onComplete={handleComplete} />}
            {children}
        </>
    );
};

export default IntroGate;
