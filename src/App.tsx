import React, { useEffect } from 'react';
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
  const {
    settings,
    tempSettings,
    isSettingsVisible,
    showSettings,
    applySettings,
    hideSettings,
    updateTempSetting,
  } = useSettings();

  const {
    soundSettings,
    tempSoundSettings,
    isSoundSettingsVisible,
    showSoundSettings,
    applySoundSettings,
    hideSoundSettings,
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

  return (
    <PageWrapper>
      <Header
        isSettingsVisible={isSettingsVisible}
        isSoundSettingsVisible={isSoundSettingsVisible}
        showSettings={showSettings}
        hideSettings={hideSettings}
        applySettings={applySettings}
        showSoundSettings={showSoundSettings}
        hideSoundSettings={hideSoundSettings}
        applySoundSettings={applySoundSettings}
      />
      <Main>
        {isSettingsVisible ? (
          <SettingsView
            isVisible={isSettingsVisible}
            tempSettings={tempSettings}
            updateTempSetting={updateTempSetting}
          />
        ) : isSoundSettingsVisible ? (
          <SoundSettingsView
            isVisible={isSoundSettingsVisible}
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
