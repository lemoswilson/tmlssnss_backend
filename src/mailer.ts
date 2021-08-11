import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // service: 'Yahoo',
    service: 'Hotmail',
    auth: {
        // user: "lemoswilson@yahoo.com",
        user: "tmlssnss@outlook.com",
        pass: '$ine$QUARE420'
    }
});

export const options = {
    from: "tmlssnss@outlook.com",
    // from: "uiubeats@gmail.com",
    to: '',
    subject: "Recover your Tmlssnss password",
    text: '',
}

export default transporter;