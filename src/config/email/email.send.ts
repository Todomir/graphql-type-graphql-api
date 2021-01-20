require('dotenv').config()
import nodemailer from 'nodemailer'
import { sign } from 'jsonwebtoken'
import AuthConfig from '../../config/auth'

export default async function sendEmail(to: string, id: string, name: string) {
  const url =
    process.env.NODE_ENV === 'production'
      ? process.env.SERVER_PROD_URL
      : process.env.SERVER_DEV_URL
  const credentials = {
    service: 'Gmail',
    type: 'login',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  }

  const { secret } = AuthConfig.jwt

  const token = sign({}, secret, {
    subject: JSON.stringify(id),
    expiresIn: 60 * 60
  })

  const transporter = nodemailer.createTransport(credentials)
  transporter.verify((err, success) => {
    if (err) {
      console.log(err)
      throw err
    } else {
      console.log('Email server is ready!')
    }
  })

  const email = {
    from: process.env.MAIL_USER,
    to,
    subject: 'JAKA | Activate your account',
    html: `
      <h2>Hello, ${name}</h2>
      <span>Thank you for registering in JAKA. There is just one more step left to use your account.</span>

      <br>
      <br>
      <br>
      <br>

      <p><a target="_" href="${url}/confirmation/${token}">Confirm your email</a> to start using JAKA</p>

      <br>

      <p>Cheers,</p>
      <p>JAKA Team.</p>
    `
  }

  transporter.sendMail(email, (err, info) => {
    if (err) {
      Promise.reject(err)
      throw err
    } else {
      Promise.resolve(info)
    }
  })
}
