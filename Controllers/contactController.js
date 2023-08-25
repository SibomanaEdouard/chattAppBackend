const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "siboedouard88@gmail.com",
                pass: "dslgjzdtrpmsruun"
            }
        });

        const mailOptions = {
            from: email,
            to: "siboedouard88@gmail.com",
            subject: `New contact from ${name}`,
            text: message
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json("The email sent to the one to help you!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
};

module.exports = sendEmail;
