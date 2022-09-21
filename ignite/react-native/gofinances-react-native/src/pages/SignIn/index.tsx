import React, { useState } from 'react';
import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';
import { useTheme } from 'styled-components'
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Alert, Platform } from 'react-native';

export function SignIn() {
    const { colors } = useTheme();
    const [ isLoading, SetIsLoading ] = useState(false);
    const { sigInWithGoogle } = useAuth();

    async function handleSigInWithGoogle() {
        SetIsLoading(true);
        try {
            return await sigInWithGoogle();
        } catch(err) {
            Alert.alert('Não foi possivel conectar com a conta google');
            console.log(err)
        } finally {
            SetIsLoading(false);
        }
    }

    return (
        <Container> 
            <Header>
                <TitleWrapper>
                    <LogoSvg width={RFValue(120)} height={RFValue(68)}/>
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito facil
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton onPress={handleSigInWithGoogle} svg={GoogleSvg}>Entre com Google</SignInSocialButton>
                    {Platform.OS === 'ios' && <SignInSocialButton svg={AppleSvg}>Entrar com apple</SignInSocialButton>}
                </FooterWrapper>

                {isLoading && <ActivityIndicator color={ colors.shape } style={{ marginTop: 18 }}/>}
            </Footer>
        </Container>
    )
}