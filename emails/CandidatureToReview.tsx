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

interface CandidatureToReviewEmailProps {
  url?: string
}

const CandidatureToReview = ({
  url = 'url not found',
}: CandidatureToReviewEmailProps) => {
  const previewText = 'Validateur, une correction vous attend!'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-[#2b309b] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Miage Connection
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Bonjour validateur,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Une nouvelle candidature a été déposée. Veuillez la corriger en cliquant sur
              le bouton ci-dessous.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#2b309b] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={url}
              >
                Corriger
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

export default CandidatureToReview
