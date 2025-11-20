import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeSettingsRow } from '@/components/TimeSettingsRow';
import type { SettingsViewProps } from '@/types';

const SettingsContainer = styled.div`
  font-size: ${theme.typography.fontSize.small};
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const SettingsView: React.FC<SettingsViewProps> = ({
  tempSettings,
  updateTempSetting,
}) => {
  return (
    <SettingsContainer>
      <TimeSettingsRow
        type="min"
        tempSettings={tempSettings}
        updateTempSetting={updateTempSetting}
      />
      <TimeSettingsRow
        type="max"
        tempSettings={tempSettings}
        updateTempSetting={updateTempSetting}
      />
    </SettingsContainer>
  );
};
