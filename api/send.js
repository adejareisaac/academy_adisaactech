import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { full_name, email, phone, experience, focus } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // 1. SAVE TO SUPABASE
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert([
        { full_name, email, phone, experience, focus }
      ]);

if (dbError) {

  if (dbError.code === "23505") {
    return res.status(400).json({
      error: "This email is already on the waitlist."
    });
  }

  return res.status(500).json({
    error: "Database insert failed",
    details: dbError.message
  });
}

    // 2. SEND EMAIL
    await resend.emails.send({
      from: "Adisaac Tech Academy <onboarding@academy.adisaactech.com.ng>",
      to: [email],
      subject: "🚀 Welcome to the Founding Cohort — You're In Early",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111">

          <h1>Welcome to Adisaac Tech Academy, ${full_name}</h1>

          <p>
            You’ve officially secured a place on the <b>Founding Cohort Waitlist</b>.
            This is not just a signup — it’s an entry point into a highly selective
            engineering training ecosystem being built for the next generation of builders.
          </p>

          <hr/>

          <h2>What happens next</h2>

          <ul>
            <li>You will get early access before public launch</li>
            <li>You will receive private curriculum previews</li>
            <li>You may be invited for priority onboarding interviews</li>
          </ul>

          <h2>Your Profile Snapshot</h2>

          <p><b>Experience Level:</b> ${experience}</p>
          <p><b>Focus Area:</b> ${focus}</p>
          <p><b>WhatsApp:</b> ${phone}</p>

          <hr/>

          <h2>Why this matters</h2>

          <p>
            The global tech industry is shifting toward AI-native engineering.
            Most developers will be replaced or stagnate — but a small group
            will learn how to build systems that integrate AI, scale globally,
            and solve real production problems.
          </p>

          <p>
            You are now on the radar of that group.
          </p>

          <br/>

          <p style="font-size:12px; color:#666">
            Adisaac Tech Innovations Ltd — Crafting Tomorrow, Today.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully joined waitlist"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}