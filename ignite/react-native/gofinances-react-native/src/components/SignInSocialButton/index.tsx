import React, { ReactNode } from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import {
    Button,
    ImageContainer,
    Text,
} from './styles'

interface Props extends RectButtonProps {
    children: ReactNode;
    svg: React.FC<SvgProps>
}

export function SignInSocialButton({ children, svg: Svg, ...rest }: Props) {
    return (
        <Button {...rest}>
            <ImageContainer>
                <Svg />
            </ImageContainer>

            <Text>
                {children}
            </Text>
        </Button>
    )
}