import React, { ReactNode } from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { 
    Container,
    Button,
    Icon,
    Title,
} from './styles';

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
}

interface Props extends RectButtonProps {
    children:ReactNode;
    type: 'up' | 'down';
    isActive: boolean;
}

export function TransactionTypeButton({
    children,
    type,
    isActive,
    ...rest
}: Props){
    return(
        <Container  isActive={isActive} type={type}>
            <Button {...rest}>
                <Icon 
                    name={icons[type]}
                    type={type}
                />
                <Title>{children}</Title>
            </Button>
        </Container>
    )
}