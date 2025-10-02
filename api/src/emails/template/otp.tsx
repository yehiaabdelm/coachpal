import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Img,
} from '@react-email/components';
import * as React from 'react';

interface OTPEmailProps {
    otp: string;
}

export const OTPEmail: React.FC<OTPEmailProps> = ({
    otp = '123456',
}) => (
    <Html>
        <Head />
        <Preview>Your CoachPal verification code is {otp}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src="https://coachpal-prod.s3.us-east-1.amazonaws.com/assets/icon-transparent.png"
                    width="40"
                    alt="CoachPal"
                    style={logo}
                />
                <Heading style={h1}>Verify Your Email</Heading>
                <Text style={text}>
                    Use the verification code below to verify your email
                </Text>
                <div style={otpContainer}>
                    <Text style={otpCode}>{otp}</Text>
                </div>
                <Text style={warningText}>
                    If you didn't request this code, please ignore this email or contact support if you have concerns.
                </Text>
                <hr style={divider} />
                <Text style={copyright}>© {new Date().getFullYear()} CoachPal</Text>
                <Text style={footer}>
                    For questions contact{' '}
                    <Link href="mailto:support@coachpal.app" style={link}>
                        support@coachpal.app
                    </Link>
                </Text>
            </Container>
        </Body>
    </Html>
);

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Arial,sans-serif',
    padding: '0 10px',
};

const container = {
    margin: '0 auto',
    padding: '40px 0',
    maxWidth: '600px',
};

const logo = {
    margin: '0 0 24px',
};

const h1 = {
    color: '#2D2D2E',
    fontSize: '22px',
    fontWeight: '400',
    lineHeight: '1.2',
    margin: '0 0 24px',
};

const text = {
    color: '#2D2D2E',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 16px',
};

const otpContainer = {
    backgroundColor: '#f5f5f7',
    borderRadius: '10px',
    margin: '10px 0',
    padding: '12px',
    textAlign: 'left' as const,
};

const otpCode = {
    color: '#1d1d1f',
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '2px',
    margin: '0',
};

const warningText = {
    color: '#86868b',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '16px 0 32px',
};

const divider = {
    border: 'none',
    borderTop: '1px solid #d2d2d7',
    margin: '32px 0',
    width: '100%',
};

const footer = {
    color: '#86868b',
    fontSize: '12px',
    lineHeight: '1.5',
    margin: '0 0 8px',
};

const copyright = {
    color: '#86868b',
    fontSize: '12px',
    lineHeight: '1.5',
    margin: '0',
};

const link = {
    color: '#0071e3',
};

export default OTPEmail;