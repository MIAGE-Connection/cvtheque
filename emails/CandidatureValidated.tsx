import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { CommonEmailType } from './email.type'

export const CandidatureValidated = ({ url = 'url not found' }: CommonEmailType) => {
  const previewText = 'Félication, votre candidature a été validée!'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-[#2b309b] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              MIAGE Connection
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Bonjour,</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Vous avez déposer une candidatue et celle-ci a été acceptée! Félicitation!.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#2b309b] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={url}
              >
                Consulter ma candidature
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              ou copier-coller cette url dans votre navigateur:{' '}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Cet email a été envoyé dans le cadre de la procédure de validation de
              candidature.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
