// Vercel serverless function to handle contact form and send email to 3 recipients
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Configure your SMTP provider here
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'SendGrid', 'Outlook', etc.
    auth: {
      user: process.env.CONTACT_EMAIL_USER, // set in Vercel dashboard
      pass: process.env.CONTACT_EMAIL_PASS, // set in Vercel dashboard
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: [
      'kamal@decibelspixels.com',
      'dhanasekar@decibelspixels.com',
      'techsupport@decibelspixels.com',
    ],
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || ''}</p><p><strong>Message:</strong><br>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
