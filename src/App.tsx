import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { useSettings } from '@/hooks/useSettings';
import { useSoundSettings } from '@/hooks/useSoundSettings';
import { useTimer } from '@/hooks/useTimer';
import { initAudio } from '@/utils/audioUtils';
import { Header } from '@/components/Header';
import { MainButton } from '@/components/MainButton';
import { SettingsView } from '@/components/SettingsView';
import { SoundSettingsView } from '@/components/SoundSettingsView';
import '@/index.css';

type ActiveView = 'main' | 'settings' | 'soundSettings';

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.background};
  border-radius: ${theme.sizes.borderRadiusLarge};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: ${theme.sizes.paddingMedium};
  gap: ${theme.sizes.gapMedium};
  -webkit-app-region: drag;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('main');

  const {
    settings,
    tempSettings,
    applySettings,
    updateTempSetting,
  } = useSettings();

  const {
    soundSettings,
    tempSoundSettings,
    applySoundSettings,
    updateTempSoundSetting,
  } = useSoundSettings();

  const {
    isRunning,
    isBeeping,
    mainButtonText,
    toggleTimer,
  } = useTimer(settings, soundSettings);

  useEffect(() => {
    initAudio();
  }, []);

  const handleShowSettings = useCallback(() => {
    setActiveView('settings');
  }, []);

  const handleShowSoundSettings = useCallback(() => {
    setActiveView('soundSettings');
  }, []);

  const handleApplySettings = useCallback(() => {
    applySettings();
    setActiveView('main');
  }, [applySettings]);

  const handleApplySoundSettings = useCallback(() => {
    applySoundSettings();
    setActiveView('main');
  }, [applySoundSettings]);

  const handleCancelSettings = useCallback(() => {
    setActiveView('main');
  }, []);

  return (
    <PageWrapper>
      <Header
        activeView={activeView}
        showSettings={handleShowSettings}
        showSoundSettings={handleShowSoundSettings}
        applySettings={handleApplySettings}
        applySoundSettings={handleApplySoundSettings}
        cancelSettings={handleCancelSettings}
      />
      <Main>
        {activeView === 'settings' ? (
          <SettingsView
            isVisible
            tempSettings={tempSettings}
            updateTempSetting={updateTempSetting}
          />
        ) : activeView === 'soundSettings' ? (
          <SoundSettingsView
            isVisible
            tempSoundSettings={tempSoundSettings}
            updateTempSoundSetting={updateTempSoundSetting}
          />
        ) : (
          <MainButton
            isRunning={isRunning}
            isBeeping={isBeeping}
            mainButtonText={mainButtonText}
            onClick={toggleTimer}
          />
        )}
      </Main>
    </PageWrapper>
  );
};

export default App;
