import nodemailer from 'nodemailer';
import { appConfig } from '@/config';

// Create transporter
const transporter = nodemailer.createTransport({
  service: appConfig.email.service,
  auth: {
    user: appConfig.email.user,
    pass: appConfig.email.pass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: options.from || appConfig.email.user,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendAssetRequestApprovalEmail = async (
  userEmail: string,
  userName: string,
  assetName: string,
  quantity: number,
  unit: string,
  approvedBy: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Asset Request Approved! 🎉</h2>
      <p>Dear ${userName},</p>
      <p>Your asset request has been <strong style="color: #28a745;">approved</strong>.</p>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Asset Details:</h3>
        <ul>
          <li><strong>Asset:</strong> ${assetName}</li>
          <li><strong>Quantity:</strong> ${quantity} ${unit}</li>
          <li><strong>Approved By:</strong> ${approvedBy}</li>
        </ul>
      </div>

      <p>Please contact the admin to collect your assets.</p>

      <br/>
      <p>Best regards,<br/>Inventory Management System</p>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject: 'Asset Request Approved',
    html,
  });
};

export const sendAssetRequestRejectionEmail = async (
  userEmail: string,
  userName: string,
  assetName: string,
  quantity: number,
  unit: string,
  reason: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">Asset Request Rejected</h2>
      <p>Dear ${userName},</p>
      <p>We regret to inform you that your asset request has been <strong style="color: #dc3545;">rejected</strong>.</p>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Request Details:</h3>
        <ul>
          <li><strong>Asset:</strong> ${assetName}</li>
          <li><strong>Quantity:</strong> ${quantity} ${unit}</li>
          <li><strong>Reason:</strong> ${reason}</li>
        </ul>
      </div>

      <p>If you have any questions, please contact your administrator.</p>

      <br/>
      <p>Best regards,<br/>Inventory Management System</p>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject: 'Asset Request Rejected',
    html,
  });
};

export const sendAssetAssignedEmail = async (
  userEmail: string,
  userName: string,
  assetName: string,
  quantity: number,
  productIds: string[],
  approvedBy: string,
  message?: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">New Assets Assigned! 📦</h2>
      <p>Dear ${userName},</p>
      <p>You have been assigned new assets.</p>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Asset Details:</h3>
        <ul>
          <li><strong>Asset:</strong> ${assetName}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Product IDs:</strong> ${productIds.join(', ')}</li>
          <li><strong>Assigned By:</strong> ${approvedBy}</li>
          ${message ? `<li><strong>Message:</strong> ${message}</li>` : ''}
        </ul>
      </div>

      <p>Please contact the admin to collect your assets.</p>

      <br/>
      <p>Best regards,<br/>Inventory Management System</p>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject: `New Assets Assigned: ${assetName}`,
    html,
  });
};