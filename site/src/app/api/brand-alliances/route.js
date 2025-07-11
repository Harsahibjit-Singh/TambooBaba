import dbConnect from '@/app/lib/dbConnect';
import BrandAlliance from '@/app/models/BrandAlliance';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';


const ADMIN_EMAILS = [
  "tamboobaba25@gmail.com", "harsahibjit@gmail.com","niteshkaggarwal@gmail.com"
  // "admin2@example.com", // replace with actual emails9815
  // "admin3@example.com",
  // "admin4@example.com",
  // "admin5@example.com"
];
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  rateLimit: true,
  maxConnections: 1,
  maxMessages: 5
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Basic validation
    const requiredFields = ['companyName', 'contactName', 'email', 'companyDescription'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Verify email format
    const email = formData.get('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Upload logo to Cloudinary if exists
    let logoUrl = '';
    const logoFile = formData.get('file');
    if (logoFile && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: 'tamboo-baba/brand-alliances',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'gif'],
            max_bytes: 5 * 1024 * 1024 // 5MB
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      logoUrl = uploadResult.secure_url;
    }

    // Prepare data for database
    const allianceData = {
      companyName: formData.get('companyName'),
      website: formData.get('website'),
      contactName: formData.get('contactName'),
      email,
      phone: formData.get('phone'),
      interests: formData.getAll('interests'),
      companyDescription: formData.get('companyDescription'),
      collaborationReason: formData.get('collaborationReason'),
      eventTypes: formData.getAll('eventTypes'),
      supportTypes: formData.getAll('supportTypes'),
      timeframe: formData.get('timeframe'),
      budget: formData.get('budget'),
      expectations: formData.get('expectations'),
      logo: logoUrl,
      additionalMessage: formData.get('additionalMessage'),
      sendBrochure: formData.get('sendBrochure') === 'on',
      isEmailVerified: true
    };

    // Save to database
    await dbConnect();
    const newAlliance = new BrandAlliance(allianceData);
    await newAlliance.save();

    // Send professional confirmation email

    const attachments = [];

    if (formData.get('sendBrochure') === 'on') {
    attachments.push({
        filename: 'Tamboo-Baba-Sponsorship-Deck.pdf',
        path: path.join(process.cwd(), 'public', 'sponsorship-deck.pdf'), // ✅ local file path
        contentType: 'application/pdf',
    });
    }



await transporter.sendMail({
  from: `"Tamboo Baba" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Thank You for Your Partnership Interest - Tamboo Baba',
  html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <!-- Email Header -->
      <div style="background-color: #111827; padding: 30px 0; text-align: center;">
        <img src="https://tamboobaba.com/hero-image.png" 
             alt="Tamboo Baba Logo" style="height: 60px; width: auto;">
      </div>

      <!-- Email Body -->
      <div style="padding: 30px; background-color: #ffffff;">
        <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">
          Thank You for Your Interest, ${formData.get('contactName')}!
        </h1>

        <p style="margin-bottom: 20px; line-height: 1.6;">
          We've received your brand alliance request from <strong>${formData.get('companyName')}</strong> 
          and appreciate your interest in partnering with Tamboo Baba.
        </p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #111827; font-size: 18px; margin-bottom: 15px;">Submission Summary</h2>
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>Company:</strong> ${formData.get('companyName')}</li>
            <li style="margin-bottom: 8px;"><strong>Contact:</strong> ${formData.get('contactName')}</li>
            <li style="margin-bottom: 8px;"><strong>Areas of Interest:</strong> ${formData.getAll('interests').join(', ')}</li>
            ${formData.get('budget') ? `<li style="margin-bottom: 8px;"><strong>Budget:</strong> ${formData.get('budget')}</li>` : ''}
          </ul>
        </div>

        ${
          formData.get('sendBrochure') === 'on'
            ? `<p style="margin-bottom: 20px; line-height: 1.6;">
                We've also attached our Sponsorship Deck PDF with this email for your reference.
               </p>`
            : ''
        }

        <p style="margin-bottom: 0; line-height: 1.6;">
          If you have any immediate questions, please contact us at 
          <a href="mailto:partnerships@tamboobaba.com" style="color: #f59e0b; text-decoration: none;">
            partnerships@tamboobaba.com
          </a>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #111827; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Tamboo Baba. All rights reserved.</p>
        <p style="margin: 0;">This email was sent to ${email} because you submitted a brand alliance request on our website.</p>
      </div>
    </div>
  `,
  attachments, // ✅ attach PDF only if sendBrochure is checked
});


//mail to admin

const mailOptions = {
  from: `"Tamboo Baba" <no-reply@tamboobaba.com>`,
  to: ADMIN_EMAILS.join(','),
  subject: "🌟 New Brand Alliance Request - Tamboo Baba",
  html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #18181b; color: #fff; max-width: 600px; margin: 0 auto; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px #0003;">
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #f59e0b 0%, #111827 100%); padding: 32px 0; text-align: center;">
      <img src="https://tamboobaba.com/hero-image.png" alt="Tamboo Baba Logo" style="height: 70px; margin-bottom: 10px;" />
      <h1 style="color: #fff; font-size: 2rem; font-weight: bold; margin: 0;">New Brand Alliance Submission</h1>
      <p style="color: #fde68a; font-size: 1.1rem; margin: 6px 0 0 0;">A new brand wants to collaborate!</p>
    </div>
    <!-- Body -->
    <div style="padding: 32px 28px; background: #23232a;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Company</td>
          <td style="padding: 10px 0;">${allianceData.companyName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Contact</td>
          <td style="padding: 10px 0;">${allianceData.contactName} (<a href="mailto:${allianceData.email}" style="color:#fbbf24;">${allianceData.email}</a>)</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Interests</td>
          <td style="padding: 10px 0;">${allianceData.interests.join(', ')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Description</td>
          <td style="padding: 10px 0;">${allianceData.companyDescription}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Website</td>
          <td style="padding: 10px 0;"><a href="${allianceData.website}" style="color:#fbbf24;">${allianceData.website}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Event Types</td>
          <td style="padding: 10px 0;">${allianceData.eventTypes.join(', ')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Support Types</td>
          <td style="padding: 10px 0;">${allianceData.supportTypes.join(', ')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Timeframe</td>
          <td style="padding: 10px 0;">${allianceData.timeframe}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Budget</td>
          <td style="padding: 10px 0;">${allianceData.budget}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Expectations</td>
          <td style="padding: 10px 0;">${allianceData.expectations}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Logo URL</td>
          <td style="padding: 10px 0;">
            ${allianceData.logo ? `<a href="${allianceData.logo}" style="color:#fbbf24;" target="_blank">View Logo</a>` : 'N/A'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Additional Message</td>
          <td style="padding: 10px 0;">${allianceData.additionalMessage}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Send Brochure?</td>
          <td style="padding: 10px 0;">${allianceData.sendBrochure ? 'Yes' : 'No'}</td>
        </tr>
      </table>
    </div>
    <!-- Footer -->
    <div style="background: #111827; color: #fde68a; text-align: center; padding: 18px 0;">
      <p style="margin: 0; font-size: 0.95rem;">Tamboo Baba Admin Notification &bull; ${new Date().getFullYear()}</p>
      <p style="margin: 0; color: #9ca3af; font-size: 0.88rem;">This message was generated automatically by the Tamboo Baba website.</p>
    </div>
  </div>
  `
};



      await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { 
        success: true, 
        message: 'Submission successful. Confirmation email sent.' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}