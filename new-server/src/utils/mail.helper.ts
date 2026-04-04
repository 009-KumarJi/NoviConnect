import {Resend} from "resend";

const DEFAULT_FROM_EMAIL = "NoviConnect <mail@krishna.novitrail.com>";
const FROM_EMAIL_PATTERN = /^[^<>]+ <[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>$/;

const buildOtpEmailHtml = (otp: string) => `
  <div style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background:#0f172a;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellspacing="0" cellpadding="0" style="background:#020617;border-radius:16px;padding:32px;border:1px solid #1e293b;box-shadow:0 10px 30px rgba(0,0,0,0.6);">
            <tr>
              <td style="text-align:center;padding-bottom:20px;">
                <h1 style="margin:0;color:#38bdf8;font-size:24px;letter-spacing:1px;">NoviConnect</h1>
                <p style="margin:6px 0 0;color:#64748b;font-size:13px;">Secure Access Verification</p>
              </td>
            </tr>
            <tr>
              <td>
                <div style="height:1px;background:linear-gradient(to right,transparent,#334155,transparent);margin:20px 0;"></div>
              </td>
            </tr>
            <tr>
              <td>
                <p style="color:#e2e8f0;font-size:16px;margin:0 0 10px;">Hello,</p>
                <p style="color:#94a3b8;font-size:15px;margin:0 0 20px;">
                  Use the following One-Time Password (OTP) to complete your authentication:
                </p>
                <div style="text-align:center;margin:30px 0;">
                  <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:8px;color:#38bdf8;background:#020617;border:1px solid #334155;padding:14px 28px;border-radius:10px;box-shadow:0 0 20px rgba(56,189,248,0.2);">
                    ${otp}
                  </span>
                </div>
                <p style="color:#94a3b8;font-size:14px;margin:0 0 10px;">
                  This code will expire in <strong style="color:#e2e8f0;">10 minutes</strong>.
                </p>
                <p style="color:#64748b;font-size:13px;margin:0;">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  return new Resend(apiKey);
};

const getFromEmail = () => {
  const from = (process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL).trim();

  if (!FROM_EMAIL_PATTERN.test(from)) {
    throw new Error(`Invalid RESEND_FROM_EMAIL format: "${from}". Expected "Name <email@domain.com>"`);
  }

  return from;
};

export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    if (!email?.trim()) {
      throw new Error("Recipient email is required");
    }

    if (!otp?.trim()) {
      throw new Error("OTP is required");
    }

    const resend = getResendClient();
    const from = getFromEmail();

    const {data, error} = await resend.emails.send({
      from,
      to: [email.trim()],
      subject: "Your NoviConnect Verification Code",
      html: buildOtpEmailHtml(otp.trim()),
    });

    if (error) {
      console.error("Resend OTP email error:", {
        recipient: email,
        from,
        error,
      });
      return false;
    }

    console.log("OTP email sent successfully:", {
      recipient: email,
      from,
      emailId: data?.id,
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", {
      recipient: email,
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
};
