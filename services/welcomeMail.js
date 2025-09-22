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
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
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
        text-align: left;
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
      .header-title {
        color: #ffffff;
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
      /* Light mode overrides */
      @media (prefers-color-scheme: light) {
        body { background: #ffffff !important; }
        .container { background: #ffffff !important; }
        .content h1 { color: #111111 !important; }
        .content p { color: #333333 !important; }
        .header-title { color: #111111 !important; }
        .footer { background: rgba(10, 37, 64, 0.06) !important; border: 1px solid rgba(0,0,0,0.08) !important; }
        .footer h1 { color: #111111 !important; }
        .footer p { color: #333333 !important; }
        .store-btn { background: rgba(0,0,0,0.04) !important; color: #111111 !important; border: 1px solid rgba(0,0,0,0.08) !important; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div style="text-align: center; padding: 16px; border-radius: 18px 18px 0 0;">

        <h1 class="header-title" style=" text-align: center; padding: 16px; font-size:2.4rem; font-weight:700;">Hi ${name}</h1>
      </div>

      <div class="content">
        <h1>Welcome to Trader365</h1>
        <p>
          You’ve just joined a platform created with a single purpose: to help traders master their psychology and achieve lasting success in the markets.
        </p>
        <p>
          The difference between good and great traders isn’t luck. It’s discipline, clarity, and the ability to make decisions without being controlled by emotion. That’s what Trader365 is designed to deliver.
        </p>
        <p>Here’s what you’ll find inside:</p>
          <p style="margin-top:8px;"><strong>A professional-grade trading journal</strong><br/>Capture every trade in detail. Build a clear record that reveals your strengths, your patterns, and the opportunities to refine your approach.</p>
          <p style="margin-top:8px;"><strong>Emotional and behavioural tracking</strong><br/>Behind every chart and number lies a decision shaped by your mindset. Trader365 helps you understand how your emotions impact your results, providing the awareness to stay in control when it matters most.</p>
          <p style="margin-top:8px;"><strong>Actionable insights powered by AI</strong><br/>Our intelligent analysis doesn’t just report data — it translates it into patterns and strategies you can act on. Think of it as your personal performance coach, available every time you trade.</p>
          <p style="margin-top:8px;"><strong>A path to consistency</strong><br/>Trading isn’t about one good day — it’s about creating a process you can trust. Trader365 is here to help you stay disciplined, focused, and prepared for the long game.</p>

        <p style="font-size:1.05rem; margin-top:12px;">Now is the time to take your first step:</p>
        <div style="text-align:center; margin-top:12px;">
          <a href="${baseUrl}/app" target="_blank" class="btn">Start Logging Your Trades</a>

          <p style="font-size:0.95rem; margin-top:18px;">You’ve chosen a platform trusted by traders who are serious about their growth. Welcome to a new standard of trading discipline.<br/><strong>The Trader365 Team</strong></p>
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