import { useState, useEffect } from "react";

export interface CookiePreferences {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
}

export const useCookieConsent = () => {
    const [hasConsent, setHasConsent] = useState<boolean>(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        functional: false,
        analytics: false,
    });

    useEffect(() => {
        const consentGiven = localStorage.getItem("sapulidi_cookie_consent");
        if (consentGiven) {
            setHasConsent(true);
            try {
                const savedPreferences = JSON.parse(consentGiven);
                setPreferences(savedPreferences);
            } catch (error) {
                console.error("Error parsing cookie preferences:", error);
            }
        }
    }, []);

    const updatePreferences = (newPreferences: CookiePreferences) => {
        localStorage.setItem("sapulidi_cookie_consent", JSON.stringify(newPreferences));
        localStorage.setItem("sapulidi_cookie_consent_date", new Date().toISOString());
        setPreferences(newPreferences);
        setHasConsent(true);
    };

    const resetConsent = () => {
        localStorage.removeItem("sapulidi_cookie_consent");
        localStorage.removeItem("sapulidi_cookie_consent_date");
        setHasConsent(false);
        setPreferences({
            necessary: true,
            functional: false,
            analytics: false,
        });
    };

    const canUseFunctional = hasConsent && preferences.functional;
    const canUseAnalytics = hasConsent && preferences.analytics;

    return {
        hasConsent,
        preferences,
        updatePreferences,
        resetConsent,
        canUseFunctional,
        canUseAnalytics,
    };
};
