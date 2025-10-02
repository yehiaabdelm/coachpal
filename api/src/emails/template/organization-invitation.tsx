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

interface BaseEmailProps {
    organization: string;
    firstName: string;
    inviteUrl: string;
    invitedBy: string;
    role: string;
}

export const InvitationEmail: React.FC<BaseEmailProps> = ({
    organization = 'Elevate',
    firstName = 'Yehia',
    invitedBy = 'Mohamed Eid',
    inviteUrl = 'https://coachpal.app',
    role = 'owner'
}) => (
    <Html>
        <Head />
        <Preview>{invitedBy} has invited you to collaborate with {organization} as an {role}.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src="https://coachpal-prod.s3.us-east-1.amazonaws.com/assets/icon-transparent.png"
                    width="40"
                    alt="CoachPal"
                    style={logo}
                />
                {/* <Heading style={h1}>Join {organization} on CoachPal</Heading> */}
                <Text style={text}> Hey {firstName}</Text>

                <Text style={text}>
                    <span style={{ fontWeight: "bold" }}>{invitedBy}</span> has invited you to join the <span style={{ fontWeight: "bold" }}>{organization}</span> organization on CoachPal as an <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>{role}</span>. Collaborate with your team and access all the tools you need in one place.</Text>
                {inviteUrl && (
                    <>
                        <div style={buttonContainer}>
                            <a href={inviteUrl} style={button}>Accept Invitation</a>
                        </div>
                        <Text style={fallbackText}>
                            If the button above doesn't work, copy and paste this URL into your browser:
                            <br />
                            <Link href={inviteUrl} style={fallbackLink}>
                                {inviteUrl}
                            </Link>
                        </Text>
                    </>
                )}
                <hr style={divider} />
                <Text style={copyright}>© {new Date().getFullYear()} CoachPal</Text>
                <Text style={footer}>
                    For questions contact{' '}
                    <Link href="mailto:yehia@coachpal.app" style={link}>
                        yehia@coachpal.app
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
    color: '#1d1d1f',
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

const buttonContainer = {
    margin: '20px 0',
};

const button = {
    backgroundColor: '#2D2D2E',
    borderRadius: '10px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
};

const fallbackText = {
    color: '#86868b',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '16px 0 32px',
};

const fallbackLink = {
    color: '#0071e3',
    textDecoration: 'none',
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

export default InvitationEmail;