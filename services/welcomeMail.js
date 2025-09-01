import nodemailer from "nodemailer";

export const welcomeMail = async (email, name) => {
  try {

    console.log("Request Body:", email, name);

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP Server Ready");

    // Get the base URL for your server (adjust according to your setup)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Styled HTML email with corrected image paths
    const html = `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- <title>Welcome to Trader 365</title> -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background: #0b1016;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        overflow-x: hidden; /* Prevent horizontal overflow */
      }
      .container {
        width: 100%;
        margin: 0 auto;
        background: #0B1016;
        /* border-radius: 18px 18px 0 0; */
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        padding: 6px;
        overflow-x: hidden; /* Prevent horizontal overflow */
        max-width: 100vw;   /* Prevent container from exceeding viewport width */
      }
      .header-img {
        width: 95%;
        
        margin: 0 auto;
        display: block;
        border-radius: 18px 18px 0 0;
      }
      .content {
        padding: 32px 28px 24px 28px;
      }
      .content h1 {
        color: #ffffff;
        font-size: 2.6rem;
        margin-bottom: 12px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      .content p {
        color: #e0e7ef;
        font-size: 1.15rem;
        margin-bottom: 18px;
        line-height: 1.5;
      }
      .btn {
        display: inline-block;
        background: #70c2e8;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 1.1rem;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: background 0.3s ease;
      }
      .btn:hover {
        background: #57add6;
      }
      .footer {
        position: relative;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        background: rgba(10, 37, 64, 0.4);
        border-radius: 38px;
        overflow: hidden;
        margin: 10px;
        padding: 40px 40px 0 20px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border-radius: 18px;
        pointer-events: none;
      }
      .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
        gap: 0;
      }
      .footer-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }
      .footer-img-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        min-width: 0;
      }
      .footer-img {
        width: 100%;
        max-width: 320px;
        display: block;
        border-radius: 0 0 18px 18px;
        margin-top: 24px;
        opacity: 0.9;
      }
      .footer h1 {
        color: #fff;
        font-size: 2rem;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        font-weight: 700;
        letter-spacing: 1px;
      }
      .footer p {
        color: #e0e7ef;
        font-size: 1.1rem;
        margin-bottom: 14px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      .store-links {
        display: flex;
        gap: 16px;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .store-links img {
        width: 140px;
      }
      .store-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.95);
        color: black;
        padding: 8px 8px;
        border-radius: 8px;
        text-decoration: none;
        width: 140px;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }
      .store-btn:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .store-btn img {
        width: 25px;
        height: auto;
        transition: width 0.2s;
      }
      .store-btn-text {
        display: flex;
        flex-direction: column;
        text-align: left;
        line-height: 1.2;
      }
      .store-btn-text .small {
        font-size: 0.9rem;
      }
      .store-btn-text .large {
        font-size: 1.15rem;
        font-weight: bold;
      }
      @media (min-width: 900px) {
        .footer-content {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
        }
        .footer-inner {
          align-items: flex-start;
          text-align: left;
          padding-left: 24px;
          padding-top: 12px;
        }
        .footer-img-container {
          justify-content: flex-end;
          align-items: flex-end;
          padding-right: 24px;
          padding-top: 12px;
        }
        .footer-img {
          margin-top: 0;
        }
      }
      @media (max-width: 900px) {
        .footer-content {
          flex-direction: column;
          align-items: center;
        }
        .footer-inner {
          align-items: center;
          text-align: center;
          padding-left: 0;
        }
        .footer-img-container {
          justify-content: center;
          padding-right: 0;
        }
      }
      @media (max-width: 480px) {
        .content h1 {
          font-size: 1.7rem;
        }
        .footer h1 {
          font-size: 1.2rem;
        }
        .btn {
          font-size: 0.9rem;
          padding: 10px 20px;
        }
        .store-btn {
          width: 100px;
          padding: 4px 4px;
        }
        .store-btn img {
          width: 16px;
        }
        .store-btn-text .small {
          font-size: 0.65rem;
        }
        .store-btn-text .large {
          font-size: 0.8rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div style="text-align: center; padding: 16px; border-radius: 18px 18px 0 0;">
        <img src="${baseUrl}/assets/logo-template.png" alt="Trader 365 badge" style="width: auto;"/>
      </div>

      <h1 style="color: #fff; text-align: center; padding: 16px; font-size:2.4rem; font-weight:700;">Hi ${name}</h1>
      <p style="color: #fff; text-align: center; padding: 16px; margin-top: -36px;">
        It is a long established fact that a reader<br>
        will be distracted.
      </p>
      <img src="${baseUrl}/assets/header.png" alt="Trader 365 badge" class="header-img" />

      <div class="content">
        <h1>Welcome to Trader 365</h1>
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using.
        </p>
        <p>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using.
        </p>

        <a href="#" target="_blank" class="btn">Get Started</a>
      </div>

      <div class="footer">
        <div class="footer-content">
          <div class="footer-inner">
            <h1>Get the Trader 365 app!</h1>
            <p>
              It is a long established fact that a reader will be distracted by the
              readable content page.
            </p>
            <div class="store-links">
              <!-- App Store Button -->
              <a href="https://play.google.com/store/apps/details?id=com.Tradesense" target="_blank" class="store-btn">
                <img src="${baseUrl}/assets/apple.png" alt="Download on the App Store" />
                <div class="store-btn-text">
                  <span class="small">Download on</span>
                  <span class="large">App Store</span>
                </div>
              </a>
              <!-- Google Play Button -->
              <a href="https://play.google.com/store/apps/details?id=com.Tradesense" target="_blank" class="store-btn">
                <img src="${baseUrl}/assets/google-store.png" alt="Get it on Google Play" />
                <div class="store-btn-text">
                  <span class="small">Get it on</span>
                  <span class="large">Google Play</span>
                </div>
              </a>
            </div>
          </div>
          <div class="footer-img-container">
            <img src="${baseUrl}/assets/mobile-footer.png" alt="Trader 365 badge" class="footer-img" />
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
    `;

    console.log("Sending welcome email to", email);

    await transporter.sendMail({
      from: `"Trader365" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Trader 365 - Your Account is Ready!",
      html,
    });

    console.log("Welcome email sent successfully!");

    return { message: "Welcome email sent successfully!" };

  } catch (error) {
    console.error("Email sending error:", error);
    return {
      error: "Failed to send welcome email",
      details: error.message
    };
  }
};