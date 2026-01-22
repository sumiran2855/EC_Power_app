import StorageService from '@/utils/secureStorage';
import { useCallback, useEffect, useState } from 'react';

type ViewMode = 'easy' | 'advanced';

export const useViewMode = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('easy');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadViewMode = async () => {
            try {
                const savedMode = await StorageService.viewMode.getMode();
                setViewMode(savedMode);
            } catch (error) {
                console.error('Failed to load view mode:', error);
                setViewMode('easy');
            } finally {
                setIsLoading(false);
            }
        };

        loadViewMode();
    }, []);

    const toggleViewMode = useCallback(async () => {
        setViewMode((currentMode) => {
            const newMode: ViewMode = currentMode === 'easy' ? 'advanced' : 'easy';
            StorageService.viewMode.setMode(newMode).catch((error) => {
                console.error('Failed to save view mode:', error);
            });
            return newMode;
        });
    }, []);

    const setMode = useCallback(async (mode: ViewMode) => {
        try {
            await StorageService.viewMode.setMode(mode);
            setViewMode(mode);
        } catch (error) {
            console.error('Failed to save view mode:', error);
        }
    }, []);

    return {
        viewMode,
        isLoading,
        toggleViewMode,
        setMode,
        isEasyView: viewMode === 'easy',
        isAdvancedView: viewMode === 'advanced',
    };
};

export default useViewMode;
