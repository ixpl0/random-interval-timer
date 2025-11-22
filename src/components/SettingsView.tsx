import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeSettingsRow } from '@/components/TimeSettingsRow';
import { convertToSeconds } from '@/utils/timeUtils';
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
  const {
    minHours,
    minMinutes,
    minSeconds,
    maxHours,
    maxMinutes,
    maxSeconds,
  } = tempSettings;

  const minTotalSeconds = convertToSeconds(minHours, minMinutes, minSeconds);
  const maxTotalSeconds = convertToSeconds(maxHours, maxMinutes, maxSeconds);

  const isMinGreaterThanMax = minTotalSeconds > maxTotalSeconds;
  const isMinTimeInvalid = isMinGreaterThanMax || minTotalSeconds === 0;
  const isMaxTimeInvalid = isMinGreaterThanMax || maxTotalSeconds === 0;

  return (
    <SettingsContainer>
      <TimeSettingsRow
        type="min"
        tempSettings={tempSettings}
        updateTempSetting={updateTempSetting}
        isInvalid={isMinTimeInvalid}
      />
      <TimeSettingsRow
        type="max"
        tempSettings={tempSettings}
        updateTempSetting={updateTempSetting}
        isInvalid={isMaxTimeInvalid}
      />
    </SettingsContainer>
  );
};
