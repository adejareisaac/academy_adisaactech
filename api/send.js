import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const {
      full_name,
      email,
      phone,
      experience,
      focus,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email required",
      });
    }

    const data = await resend.emails.send({
      from: "Adzafact Academy <onboarding@academy.adzafact.com.ng>",
      to: [email],
      subject: "Welcome to Adzafact Academy",
      html: `
        <h1>Welcome ${full_name}</h1>

        <p>You have successfully joined the waitlist.</p>

        <p>
          Experience Level: ${experience}
        </p>

        <p>
          Preferred Focus: ${focus}
        </p>

        <p>
          Phone: ${phone}
        </p>
      `,
    });

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}