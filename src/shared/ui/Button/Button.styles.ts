import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface StyledButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.blue600};
    color: ${({ theme }) => theme.colors.white};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.blue700};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.gray700};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray300};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};

    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray700};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray100};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSize.base};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.fontSize.lg};
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: all ${({ theme }) => theme.transition.normal};
  cursor: pointer;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant = 'primary' }) => variantStyles[$variant]}
  ${({ $size = 'md' }) => sizeStyles[$size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue600};
    outline-offset: 2px;
  }
`;
