const nodemailer = require("nodemailer");
const { Validator } = require("node-input-validator");

module.exports.send_mail_post = async (req, res) => {
  const v = new Validator(req.body, {
    email: "required|email",
    name: "required|maxLength:50",
    subject: "required|maxLength:50",
    message: "required|minLength:50|maxLength:250",
  });

  v.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { name, email, subject, message } = req.body;
      const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: parseInt(process.env.MAILER_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
        tls: {
          //We included this tls property because we use localhost(non SSL)
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      let mailOptions = {
        from: `'OpenCHAT' <${process.env.MAILER_USER}>`, // sender address
        to: process.env.MAILER_USER, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: `<h2>Message from ${name}</h2>
        <p>${message}</p>
        <p>Sender email: ${email}</p>`, // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json("Something went wrong...");
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).json("Your message was successfully sent!");
      });
    }
  });
};
