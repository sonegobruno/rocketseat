import React, {useEffect, useCallback,  useState, useRef, useImperativeHandle, forwardRef} from 'react';
import { TextInputProps } from 'react-native';

import { Container, TextInput, Icon } from './styles';
import { useField } from '@unform/core';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: {};
}

interface InputValueRef {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef,InputProps> = ({name, icon, containerStyle = {},  ...rest}, ref) => {
    const inputElementRef = useRef<any>(null);
    const { registerField, defaultValue='', fieldName, error } = useField(name);
    const inputRef = useRef<InputValueRef>({value: defaultValue});

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    useImperativeHandle(ref, () =>({
        focus() {
            inputElementRef.current.focus();
        }
    })); 

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
            setValue(ref: any, value: string) {
                inputRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue(){
                inputRef.current.value = '';
                inputElementRef.current.clear();
            }
        })
    },[registerField, fieldName]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    },[]);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputRef.current.value);
    },[]);

    return(
        <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
            <TextInput
                ref={inputElementRef}
                {...rest}
                placeholderTextColor="#666360"
                defaultValue={defaultValue}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={(value) => {inputRef.current.value = value;}}
            />
        </Container>

    );
}

export default forwardRef(Input);