import React, { ReactNode } from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { 
    Container,
    Category,
    Icon,
} from './styles';

interface Props extends RectButtonProps {
    children: ReactNode;
}

export function CategorySelectButton({children, ...rest}: Props) {
    return (
        <Container {...rest} activeOpacity={0.7}>
            <Category>{children}</Category>
            <Icon  name="chevron-down"/>
        </Container>
    )
}