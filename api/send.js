import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    try {

        const { full_name, email } = req.body;

        const data = await resend.emails.send({
            from: "Adisaac Academy <onboarding@adisaac.tech>",
            to: [email],
            subject: "Welcome to Adisaac Tech Academy",
            html: `
                <h1>Welcome ${full_name}</h1>

                <p>
                    You have successfully joined the founding waitlist.
                </p>

                <p>
                    More updates coming soon.
                </p>
            `,
        });

        return res.status(200).json(data);

    } catch (error) {

        return res.status(500).json({
            error: error.message,
        });

    }
}