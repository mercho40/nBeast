import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Button,
  Tailwind,
} from '@react-email/components';

interface EmailTemplateProps {
  username: string;
  url: string;
  productName: string;
  isPasswordReset?: boolean;
  dict: {
    email: {
      signInPreview: string;
      passwordResetPreview: string;
      signInSubject: string;
      passwordResetSubject: string;
      hello: string;
      signInRequest: string;
      passwordResetRequest: string;
      signInButton: string;
      resetPasswordButton: string;
      orCopyLink: string;
      linkExpires: string;
      didntRequest: string;
      allRightsReserved: string;
    };
  };
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  username,
  url,
  productName,
  isPasswordReset = false,
  dict,
}) => {
  const previewText = isPasswordReset
    ? dict.email.passwordResetPreview
    : dict.email.signInPreview;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-solid border-gray-200 bg-white p-10">
            <Heading as="h1" className="text-2xl font-bold text-gray-800 text-center">
              {isPasswordReset ? dict.email.passwordResetSubject : dict.email.signInSubject}
            </Heading>
            <Section className="my-8">
              <Text className="text-gray-700">{dict.email.hello} {username},</Text>
              <Text className="text-gray-700">
                {isPasswordReset
                  ? dict.email.passwordResetRequest
                  : dict.email.signInRequest}
              </Text>

              <Section className="text-center my-6">
                <Button
                  href={url}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium no-underline"
                >
                  {isPasswordReset ? dict.email.resetPasswordButton : dict.email.signInButton}
                </Button>
              </Section>

              <Text className="text-gray-700 text-center text-sm">
                {dict.email.orCopyLink}
              </Text>
              <Text className="text-blue-600 text-center text-sm break-all">
                {url}
              </Text>
              <Text className="text-gray-700 text-sm">
                {dict.email.linkExpires}
              </Text>
            </Section>
            <Hr className="border-t border-gray-300 my-6" />
            <Text className="text-xs text-gray-500 text-center">
              {dict.email.didntRequest}
            </Text>
            <Text className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} {productName}. {dict.email.allRightsReserved}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


