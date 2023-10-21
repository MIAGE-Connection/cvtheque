import { render } from '@react-email/render'
import nodemailer from 'nodemailer'
import { CandidatureToReviewEmail, CandidatureValidatedEmail } from './mail.type'
import { CandidatureToReview, CandidatureValidated } from '../../../../emails'

type EmailPayload = {
  to: string
  subject: string
  html: string
}

const APP_URL = process.env.APP_URL

const smtpOptions = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}

const sendEmail = (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  })

  return transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    ...data,
  })
}

export const mailService = {
  /**
   * Envoi d'un mail à la mailing list de miage-connection des validateurs
   * @param fullname Le prénom-nom du candidat
   * @param candidatureId L'id de la candidature pour la redirection
   */
  sendCandidatureToReviewEmail({ fullname, candidatureId }: CandidatureToReviewEmail) {
    sendEmail({
      to: 'validateur-cvtheque@miage-connection.fr',
      subject: `Candidature de ${fullname} à corriger`,
      html: render(
        CandidatureToReview({
          url: `${APP_URL}/list/${candidatureId}`,
        }),
      ),
    })
  },

  /**
   * Envoi d'un mail à la personne dont la candidature a été validée
   * @param userId L'id de l'utilisateur
   * @param candidatureId L'id de la candidature pour la redirection
   */
  sendCandidatureValidatedEmail({ candidatureId, email }: CandidatureValidatedEmail) {
    sendEmail({
      to: email,
      subject: `Votre candidature a été validée`,
      html: render(
        CandidatureValidated({
          url: `${APP_URL}/list/${candidatureId}`,
        }),
      ),
    })
  },
}
