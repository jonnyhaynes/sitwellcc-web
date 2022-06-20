import sendgrid from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY || '';
sendgrid.setApiKey(apiKey);

const sendEmail = async (req: any, res: any) => {
    let to = 'team@sitwell.cc';

    switch (req.body.query) {
        case 'Club Rides':
            to = 'captain@sitwell.cc';
            break;
        case 'Go-Ride coaching':
            to = 'coach@sitwell.cc';
            break;
        case 'Races':
            to = 'racing@sitwell.cc';
            break;
        case 'Charity work':
            to = 'community@sitwell.cc';
            break;
        case 'Membership':
            to = 'membership@sitwell.cc';
            break;
        case 'Kit':
            to = 'kit@sitwell.cc';
            break;
        case 'Welfare & Safeguarding':
            to = 'welfare@sitwell.cc';
            break;
        default:
            to = 'team@sitwell.cc'
            break;
    }

    try {
        await sendgrid.send({
            to,
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
