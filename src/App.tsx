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
    resetTempSettings,
  } = useSettings();

  const {
    soundSettings,
    tempSoundSettings,
    applySoundSettings,
    updateTempSoundSetting,
    updateTempVolume,
    resetTempSoundSettings,
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

  const settingsActions = {
    show: useCallback(() => setActiveView('settings'), []),
    apply: applySettings,
  };

  const soundSettingsActions = {
    show: useCallback(() => setActiveView('soundSettings'), []),
    apply: applySoundSettings,
  };

  const goToMain = useCallback(() => {
    resetTempSettings();
    resetTempSoundSettings();
    setActiveView('main');
  }, [resetTempSettings, resetTempSoundSettings]);

  return (
    <PageWrapper>
      <Header
        activeView={activeView}
        settingsActions={settingsActions}
        soundSettingsActions={soundSettingsActions}
        goToMain={goToMain}
      />
      <Main>
        {activeView === 'settings' ? (
          <SettingsView
            tempSettings={tempSettings}
            updateTempSetting={updateTempSetting}
          />
        ) : activeView === 'soundSettings' ? (
          <SoundSettingsView
            tempSoundSettings={tempSoundSettings}
            updateTempSoundSetting={updateTempSoundSetting}
            updateTempVolume={updateTempVolume}
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
