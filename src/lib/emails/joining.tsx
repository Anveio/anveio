import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  renderAsync,
} from '@react-email/components';
import { ResendClient } from './resend';

interface EmailTemplateProps {
  verificationToken: string;
  destinationEmailAddress: string;
}

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://anveio.com';

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  destinationEmailAddress,
  verificationToken,
}) => {
  const verificationUrl = new URL(
    `${BASE_URL}/api/auth/verify-email?token=${verificationToken}&email=${destinationEmailAddress}`
  ).href;

  const previewText = `Confirm your email address to get started with Webm.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]'>
            <Section className='mt-[32px]'>
              <Img
                src={`${BASE_URL}/vercel.svg`}
                width='40'
                height='37'
                alt=''
                className='my-0 mx-auto'
              />
            </Section>
            <Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
              Confirm this email address for <strong>Webm</strong>
            </Heading>
            <Text className='text-black text-[14px] leading-[24px]'>
              Hello,
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              Click the button below to confirm your email address for Webm.
              Doing so will allow you to upload more
            </Text>
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                style={{
                  padding: '12px 20px',
                }}
                className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center'
                href={verificationUrl}
              >
                Confirm email
              </Button>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              or copy and paste this URL into your browser:{' '}
              <Link
                href={verificationUrl}
                className='text-blue-600 no-underline'
              >
                {verificationUrl}
              </Link>
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account's safety, please
              reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const sendAccountVerificationEmail = async ({
  destinationEmailAddress,
  verificationToken,
}: EmailTemplateProps) => {
  console.log(`Sending email to ${destinationEmailAddress}`);

  const html = await renderAsync(
    EmailTemplate({
      destinationEmailAddress,
      verificationToken,
    }) as React.ReactElement
  );

  return ResendClient.emails.send({
    from: 'Anveio <welcome@webm.anveio.com>',
    to: [destinationEmailAddress],
    subject: 'Confirm your email for Webm',
    html,
    tags: [
      {
        name: 'category',
        value: 'confirm_email',
      },
    ],
  });
};
