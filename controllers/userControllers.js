const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
require('dotenv').config()
const path = require('path')

const MAIL = process.env.MAIL
const PASS = process.env.PASS




exports.userSignupController = async (req, res, next) => {
    let testAccount = await nodemailer.createTestAccount();


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    // message

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "User registeration sucessfull", // Subject line
        text: "sucessfully register with us", // plain text body
        html: "succesfully register with Us", // html body
    }

    transporter.sendMail(message).then((info) => {
        console.log(info);
        return res.status(201).json({
            msg: "you should get an email",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)

        });
    }).catch(error => {
        return res.status(500).json({ error })
    })
    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    // });

    // res.status(201).json("User Signup..!")
}


exports.productBillController = (req, res, next) => {

    const { userMail } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: MAIL, // generated ethereal user
            pass: PASS, // generated ethereal password
        },
    }
    let transport = nodemailer.createTransport(config)

    let mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Bilbo-Enterprises',
            link: 'https://bilboEnterprises.com/',
            attachments: [
                {
                    filename: 'fileName.pdf',
                    path: path.join(__dirname, './assests/taxInvoice.pdf'), // <= Here
                    contentType: 'application/pdf'
                }]
        }
    })

    let response = {
        body: {
            name: "Bank Of Baroda (Shivaji Park)",
            intro: 'your bill was pending for order no. #BQ11q243',
            table: {
                data: [
                    {
                        item: 'Bank Assests Xerox',
                        description: 'FATCA-FORM,KYC-FORM and other maiterials',
                        price: '₹ 2500/-'
                    }
                ]
            },
            outro: "Looking forward to do more business",

        }
    }

    let mail = mailGenerator.generate(response)
    let message = {
        from: MAIL,
        to: userMail,
        subject: 'Place Oder',
        html: mail
    }

    transport.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should get the mail"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("product Bill..!")
}