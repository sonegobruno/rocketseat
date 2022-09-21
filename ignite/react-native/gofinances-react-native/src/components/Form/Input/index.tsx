import React from 'react';
import { TextInputProps } from 'react-native';

interface Props extends TextInputProps {

}

import { 
    Container
} from './styles';

export function Input({...rest}: Props) {
    return(
        <Container {...rest}></Container>
    )
}