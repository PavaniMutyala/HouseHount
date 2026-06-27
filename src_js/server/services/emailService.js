import nodemailer from "nodemailer";

// Lazy initialize transporter
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log(`Initializing SMTP connection to ${host}:${port || 587}...`);
    transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: port === "465",
      auth: { user, pass },
    });
  } else {
    console.log(
      "No SMTP configuration detected in environment. Initializing Ethereal test account...",
    );
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log("--------------------------------------------------");
      console.log("SUCCESS: Nodemailer initialized with Ethereal SMTP!");
      console.log(`Username: ${testAccount.user}`);
      console.log(
        "Ethereal inbox is active. Any sent email will output a test link.",
      );
      console.log("--------------------------------------------------");
    } catch (err) {
      console.warn(
        "Failed to initialize Ethereal test account. Operating in simulated console log mode.",
        err.message || err,
      );
      transporter = {
        sendMail: async (options) => {
          console.log("==================================================");
          console.log("[SIMULATED EMAIL DELEGATOR]");
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log("Body Preview:\n", options.text);
          console.log("==================================================");
          return { messageId: "simulated-message-" + Date.now() };
        },
      };
    }
  }
  return transporter;
}

async function sendMail(payload) {
  try {
    const transport = await getTransporter();
    const fromAddress = process.env.SMTP_FROM_EMAIL || "no-reply@househunt.com";
    const info = await transport.sendMail({
      from: `"HouseHunt Smart Rentals" <${fromAddress}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    console.log(
      `Email successfully routed to ${payload.to}. Message ID: ${info.messageId}`,
    );
    // Retrieve Ethereal URL if applicable
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("==================================================");
      console.log(`📧 ETHEREAL PREVIEW URL: ${previewUrl}`);
      console.log("==================================================");
    }
    return info;
  } catch (error) {
    console.error(
      `Failed to send email to ${payload.to}:`,
      error.message || error,
    );
    return null;
  }
}

// Generate premium email header HTML
const getEmailHeader = (title, subtitle) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.15);
      padding: 8px 16px;
      border-radius: 9999px;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .logo-text {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #ffffff;
    }
    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .subtitle {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: #bfdbfe;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text-block {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
    }
    .card {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 12px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 8px;
    }
    .grid-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .grid-row:last-child {
      margin-bottom: 0;
    }
    .label {
      font-weight: 600;
      color: #64748b;
    }
    .value {
      color: #1e293b;
      font-weight: 500;
      text-align: right;
    }
    .button-container {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 15px;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <span class="logo-text">🔑 HOUSEHUNT SMART RENTALS</span>
        </div>
        <h1 class="title">${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
      <div class="content">
`;

const getEmailFooter = () => `
      </div>
      <div class="footer">
        <p>This is an automated operational notification regarding your HouseHunt account.</p>
        <p>© 2026 HouseHunt Smart Rentals Inc. All rights reserved.</p>
        <p>742 Jubilee Hills, Road No. 36, Hyderabad, India</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export class BookingEmailService {
  /**
   * Sends an automated email to both Tenant & Owner notifying them that a booking has been requested
   */
  static async sendBookingRequestedNotification(details) {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(details.price);

    const formattedDate = new Date(details.moveInDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    // 1. Send Email to the Tenant confirming their request was filed successfully
    const tenantHtml = `
      ${getEmailHeader("Booking Request Submitted!", "Your request is now pending review by the property owner.")}
      <h2 class="greeting">Hi ${details.tenantName},</h2>
      <p class="text-block">
        Great news! Your booking request has been successfully registered. The property host is reviewing your reservation details and will respond shortly.
      </p>
      
      <div class="card">
        <div class="card-title">Reservation Summary</div>
        <div class="grid-row">
          <span class="label">Property:</span>
          <span class="value">${details.propertyTitle}</span>
        </div>
        <div class="grid-row">
          <span class="label">Location:</span>
          <span class="value">${details.propertyLocation}</span>
        </div>
        <div class="grid-row">
          <span class="label">Expected Move-in:</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="grid-row">
          <span class="label">Price per Month:</span>
          <span class="value" style="color: #2563eb; font-weight: 700;">${formattedPrice}</span>
        </div>
        <div class="grid-row">
          <span class="label">Booking Reference:</span>
          <span class="value" style="font-family: monospace;">#${details.bookingId}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Host Contact Details</div>
        <div class="grid-row">
          <span class="label">Host Name:</span>
          <span class="value">${details.ownerName}</span>
        </div>
        <div class="grid-row">
          <span class="label">Host Email:</span>
          <span class="value">${details.ownerEmail}</span>
        </div>
      </div>

      <p class="text-block">
        Once the owner approves, you will receive another automated notification with the final confirmation. No action is required from you at this moment.
      </p>
      ${getEmailFooter()}
    `;

    const tenantText = `
      Hi ${details.tenantName},
      Your booking request for "${details.propertyTitle}" has been submitted successfully!
      
      Booking Reference: #${details.bookingId}
      Location: ${details.propertyLocation}
      Move-in Date: ${formattedDate}
      Price per Month: ${formattedPrice}
      
      Host Details:
      Name: ${details.ownerName}
      Email: ${details.ownerEmail}
      
      We will notify you immediately once the host reviews your request.
    `;

    // 2. Send Email to the Owner notifying them of a new incoming tenant request
    const ownerHtml = `
      ${getEmailHeader("New Booking Request Received!", "A user wants to book your rental listing.")}
      <h2 class="greeting">Hi ${details.ownerName},</h2>
      <p class="text-block">
        You have received a new booking proposal for your listing: <strong>${details.propertyTitle}</strong>. Please review the guest details below and log into your dashboard to accept or decline the reservation.
      </p>
      
      <div class="card">
        <div class="card-title">Reservation Details</div>
        <div class="grid-row">
          <span class="label">Requested Listing:</span>
          <span class="value">${details.propertyTitle}</span>
        </div>
        <div class="grid-row">
          <span class="label">Proposed Move-in:</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="grid-row">
          <span class="label">Monthly Payout:</span>
          <span class="value" style="color: #16a34a; font-weight: 700;">${formattedPrice}</span>
        </div>
        <div class="grid-row">
          <span class="label">Booking Reference:</span>
          <span class="value" style="font-family: monospace;">#${details.bookingId}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Prospective Guest Profile</div>
        <div class="grid-row">
          <span class="label">Guest Name:</span>
          <span class="value">${details.tenantName}</span>
        </div>
        <div class="grid-row">
          <span class="label">Guest Email:</span>
          <span class="value">${details.tenantEmail}</span>
        </div>
        <div class="grid-row">
          <span class="label">Guest Phone:</span>
          <span class="value">${details.tenantPhone || "Not provided"}</span>
        </div>
      </div>

      <p class="text-block" style="text-align: center;">
        Please log into HouseHunt Smart Rentals to approve or reject this request. Keeping responses swift ensures high rank ratings on the platform!
      </p>
      ${getEmailFooter()}
    `;

    const ownerText = `
      Hi ${details.ownerName},
      You have received a new booking request for "${details.propertyTitle}"!
      
      Booking Reference: #${details.bookingId}
      Move-in Date: ${formattedDate}
      Monthly Payout: ${formattedPrice}
      
      Prospective Tenant Details:
      Name: ${details.tenantName}
      Email: ${details.tenantEmail}
      Phone: ${details.tenantPhone || "Not provided"}
      
      Please review and take action from your HouseHunt owner dashboard.
    `;

    // Fire off both email tasks in parallel background mode
    return Promise.all([
      sendMail({
        to: details.tenantEmail,
        subject: `[Pending Review] Booking Request Submitted for ${details.propertyTitle}`,
        html: tenantHtml,
        text: tenantText,
      }),
      sendMail({
        to: details.ownerEmail,
        subject: `[New Action Required] Booking Request Received for ${details.propertyTitle}`,
        html: ownerHtml,
        text: ownerText,
      }),
    ]);
  }

  /**
   * Sends an automated email confirming the booking was successfully approved
   */
  static async sendBookingConfirmedNotification(details) {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(details.price);

    const formattedDate = new Date(details.moveInDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    // 1. Email to Tenant: Booking is CONFIRMED!
    const tenantHtml = `
      ${getEmailHeader("Booking Confirmed & Finalized!", "Your rental request has been approved by the host.")}
      <h2 class="greeting">Congratulations, ${details.tenantName}! 🎉</h2>
      <p class="text-block">
        Fantastic news! Your booking request for <strong>${details.propertyTitle}</strong> has been officially approved by the host. Your new home is ready for you!
      </p>
      
      <div class="card" style="border-left: 5px solid #16a34a; background-color: #f0fdf4;">
        <div class="card-title" style="color: #15803d;">Booking Confirmed</div>
        <div class="grid-row">
          <span class="label">Property Name:</span>
          <span class="value" style="font-weight: 700;">${details.propertyTitle}</span>
        </div>
        <div class="grid-row">
          <span class="label">Location:</span>
          <span class="value">${details.propertyLocation}</span>
        </div>
        <div class="grid-row">
          <span class="label">Confirmed Move-in:</span>
          <span class="value" style="font-weight: 700; color: #16a34a;">${formattedDate}</span>
        </div>
        <div class="grid-row">
          <span class="label">Monthly Rental Price:</span>
          <span class="value" style="color: #16a34a; font-weight: 700;">${formattedPrice}</span>
        </div>
        <div class="grid-row">
          <span class="label">Reference Code:</span>
          <span class="value" style="font-family: monospace;">#${details.bookingId}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Host Contact Details</div>
        <div class="grid-row">
          <span class="label">Host Name:</span>
          <span class="value">${details.ownerName}</span>
        </div>
        <div class="grid-row">
          <span class="label">Host Email:</span>
          <span class="value">${details.ownerEmail}</span>
        </div>
        <div class="grid-row">
          <span class="label">Host Phone:</span>
          <span class="value">${details.ownerPhone || "Not provided"}</span>
        </div>
      </div>

      <p class="text-block">
        Please coordinate directly with your host regarding key pickup, move-in checklists, and security deposit transactions. Welcome home!
      </p>
      ${getEmailFooter()}
    `;

    const tenantText = `
      Hi ${details.tenantName},
      CONGRATULATIONS! Your booking for "${details.propertyTitle}" is CONFIRMED and has been approved by the host!
      
      Booking Reference: #${details.bookingId}
      Location: ${details.propertyLocation}
      Confirmed Move-In Date: ${formattedDate}
      Price: ${formattedPrice}
      
      Host Contact Details:
      Name: ${details.ownerName}
      Email: ${details.ownerEmail}
      Phone: ${details.ownerPhone || "Not provided"}
      
      Please contact your host to arrange key handovers. Enjoy your new stay!
    `;

    // 2. Email to Host: Confirmation of Successful Placement
    const ownerHtml = `
      ${getEmailHeader("Booking Finalized Successfully!", "You have successfully booked a guest for your listing.")}
      <h2 class="greeting">Hi ${details.ownerName},</h2>
      <p class="text-block">
        Congratulations! You have successfully finalized a placement for your listing: <strong>${details.propertyTitle}</strong>. Your listing has been automatically marked as unavailable.
      </p>
      
      <div class="card" style="border-left: 5px solid #2563eb; background-color: #eff6ff;">
        <div class="card-title" style="color: #1e40af;">Placement Confirmed</div>
        <div class="grid-row">
          <span class="label">Listing:</span>
          <span class="value">${details.propertyTitle}</span>
        </div>
        <div class="grid-row">
          <span class="label">Move-in Date:</span>
          <span class="value" style="font-weight: 700;">${formattedDate}</span>
        </div>
        <div class="grid-row">
          <span class="label">Monthly Income:</span>
          <span class="value" style="color: #2563eb; font-weight: 700;">${formattedPrice}</span>
        </div>
        <div class="grid-row">
          <span class="label">Booking Reference:</span>
          <span class="value" style="font-family: monospace;">#${details.bookingId}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Tenant Profile Information</div>
        <div class="grid-row">
          <span class="label">Tenant Name:</span>
          <span class="value">${details.tenantName}</span>
        </div>
        <div class="grid-row">
          <span class="label">Tenant Email:</span>
          <span class="value">${details.tenantEmail}</span>
        </div>
        <div class="grid-row">
          <span class="label">Tenant Phone:</span>
          <span class="value">${details.tenantPhone || "Not provided"}</span>
        </div>
      </div>

      <p class="text-block">
        We recommend connecting with your tenant to arrange security deposits, key handover schedules, and lease signature documentation.
      </p>
      ${getEmailFooter()}
    `;

    const ownerText = `
      Hi ${details.ownerName},
      You have successfully confirmed a tenant for "${details.propertyTitle}"!
      
      Booking Reference: #${details.bookingId}
      Move-In Date: ${formattedDate}
      Monthly Income: ${formattedPrice}
      
      Tenant Contact Details:
      Name: ${details.tenantName}
      Email: ${details.tenantEmail}
      Phone: ${details.tenantPhone || "Not provided"}
      
      Please contact them to complete standard rental agreements.
    `;

    // Fire off both email tasks in parallel background mode
    return Promise.all([
      sendMail({
        to: details.tenantEmail,
        subject: `🎉 [Booking Confirmed] Welcome to Your New Home: ${details.propertyTitle}`,
        html: tenantHtml,
        text: tenantText,
      }),
      sendMail({
        to: details.ownerEmail,
        subject: `🔑 [Placement Finalized] Booking Approved for ${details.propertyTitle}`,
        html: ownerHtml,
        text: ownerText,
      }),
    ]);
  }
}
