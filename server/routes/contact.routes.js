const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, vehicle, service, suburb, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and message are required.'
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #c0392b; margin-top: 0;">New Website Enquiry</h2>
        <p style="color: #555;">You have received a new customer enquiry from the <strong>AutoCare on Wheels</strong> website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}" style="color: #c0392b; font-weight: bold;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Vehicle:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${vehicle || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service Needed:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${service || 'General Enquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Suburb / Area:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${suburb || 'Canberra'}</td>
          </tr>
        </table>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <h4 style="margin-top: 0; color: #333;">Message:</h4>
          <p style="color: #555; white-space: pre-wrap; margin-bottom: 0;">${message}</p>
        </div>
        
        <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888; text-align: center;">
          AutoCare on Wheels &bull; Canberra Mobile Mechanic &bull; <a href="https://www.autocareonwheels.com.au" style="color: #888;">autocareonwheels.com.au</a>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@autocareonwheels.com.au',
        subject: `New Enquiry from ${name} - ${service || 'General'}`,
        html: emailHtml,
        text: `New Enquiry:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nVehicle: ${vehicle}\nService: ${service}\nSuburb: ${suburb}\nMessage:\n${message}`
      });
    } catch (mailError) {
      console.error('Failed to send contact notification email:', mailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.'
    });
  } catch (error) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing your enquiry. Please call us directly on 0427 563 913.'
    });
  }
});

module.exports = router;
