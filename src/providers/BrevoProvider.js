/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const brevo = require('@getbrevo/brevo')
const { env } = require('~/config/environment')

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Khỏi tạo smtpEmail
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản gửi mail
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Những tài khoản nhận email
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = customHtmlContent

  // Gọi hành động gửi mail
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
