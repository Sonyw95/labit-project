import React, {memo} from "react";
import {validators} from "../../utils/validators.js";
import {Group, Progress, Stack} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";

const PasswordStrengthIndicator = memo(({ password }) => {
    const validation = validators.password(password);
    const { score, requirements } = validation;

    const getStrengthColor = () => {
        if (score <= 2) {
            return 'red';
        }
        if (score <= 3) {
            return 'yellow';
        }
        return 'green';
    };
    const getRequirementText = (key) => {
        const texts = {
            minLength: '8자 이상',
            hasUpper: '대문자 포함',
            hasLower: '소문자 포함',
            hasNumber: '숫자 포함',
            hasSpecial: '특수문자 포함'
        };
        return texts[key] || key;
    };

    const getStrengthText = () => {
        if (score <= 2) {
            return '약함';
        }
        if (score <= 3) {
            return '보통';
        }
        return '강함';
    };

    return (
        <Stack gap="xs">
            <Group justify="space-between">
                <Text size="sm">비밀번호 강도</Text>
                <Text size="sm" c={getStrengthColor()}>
                    {getStrengthText()}
                </Text>
            </Group>

            <Progress
                value={(score / 5) * 100}
                color={getStrengthColor()}
                size="sm"
            />

            <Stack gap={4}>
                {Object.entries(requirements).map(([key, met]) => (
                    <Group key={key} gap="xs">
                        {met ? (
                            <IconCheck size={12} style={{ color: 'green' }} />
                        ) : (
                            <IconX size={12} style={{ color: 'red' }} />
                        )}
                        <Text size="xs" c={met ? 'green' : 'red'}>
                            {getRequirementText(key)}
                        </Text>
                    </Group>
                ))}
            </Stack>
        </Stack>
    );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export default PasswordStrengthIndicator;