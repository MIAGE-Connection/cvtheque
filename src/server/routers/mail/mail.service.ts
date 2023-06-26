import { render } from '@react-email/render'
import nodemailer from 'nodemailer'
import CandidatureToReview from '../../../../emails/CandidatureToReview'

type EmailPayload = {
  to: string
  subject: string
  html: string
}

type CandidatureToReviewEmail = {
  fullname: string
  candidatureId: string
}

const APP_URL = process.env.APP_URL

const smtpOptions = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
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
   * @param candidatureId L'id de la candidature
   */
  sendCandidatureToReviewEmail({ fullname, candidatureId }: CandidatureToReviewEmail) {
    sendEmail({
      to: 'validateur-cvtheque@miage-connection.fr',
      subject: `Candidature de ${fullname} à corriger`,
      html: render(
        CandidatureToReview({
          url: `${APP_URL}/list/${candidatureId}`,
          fullname,
        }),
      ),
    })
  },
}
