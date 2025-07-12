import React from 'react';
import styled from 'styled-components';
import { useTimer } from './hooks/useTimer';
import { useSettings } from './hooks/useSettings';
import { Header } from './components/Header';
import { MainButton } from './components/MainButton';
import { SettingsView } from './components/SettingsView';
import './index.css';

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 6px;
  -webkit-app-region: drag;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const {
    isSettingsVisible,
    settings,
    tempSettings,
    showSettings,
    hideSettings,
    applySettings,
    updateTempSetting,
  } = useSettings();

  const {
    isRunning,
    mainButtonText,
    isBeeping,
    toggleTimer,
  } = useTimer(settings);

  return (
    <PageWrapper>
      <Header
        isSettingsVisible={isSettingsVisible}
        showSettings={showSettings}
        hideSettings={hideSettings}
        applySettings={applySettings}
      />
      <Main>
        {!isSettingsVisible && (
          <MainButton
            isRunning={isRunning}
            isBeeping={isBeeping}
            mainButtonText={mainButtonText}
            onClick={toggleTimer}
          />
        )}
        {isSettingsVisible && (
          <SettingsView
            isVisible={isSettingsVisible}
            tempSettings={tempSettings}
            updateTempSetting={updateTempSetting}
          />
        )}
      </Main>
    </PageWrapper>
  );
}

export default App;
