import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req: any, res: any) {
    try {
        await sendgrid.send({
            to: 'team@sitwell.cc',
            from: 'noreply@sitwell.cc',
            replyTo: `${req.body.email}`,
            subject: `Website Enquiry : ${req.body.query}`,
            text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nQuery: ${req.body.query}\nMessage: ${req.body.message}`,
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).json({ error: "" });
}

export default sendEmail;
