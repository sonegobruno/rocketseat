import styled from 'styled-components'

export const HomeContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`

export const BaseButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme['gray-100']};

  gap: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const StartCountDownButton = styled(BaseButton)`
  background: ${({ theme }) => theme['green-500']};

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    background: ${({ theme }) => theme['green-700']};
  }
`

export const StopCountDownButton = styled(BaseButton)`
  background: ${({ theme }) => theme['red-500']};

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    background: ${({ theme }) => theme['red-700']};
  }
`
