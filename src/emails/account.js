const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'TasksManager123@gmail.com', // generated ethereal user
        pass: '12345678()_+' // generated ethereal password
    }
});

const sendWelcomeEmail = (email, name) => {
    transporter.sendMail({
        from: 'TasksManager123@gmail.com',
        to: email,
        subject: 'Welcoming Email',
        text: `Welcome to the Task Manager API ${name}.`
    }) 
}

const sendCalcelationEmail = (email, name) => {
    transporter.sendMail({
        from: 'TasksManager123@gmail.com',
        to: email,
        subject: 'Sorry To See You Go!!',
        text: `GoodBye, ${name}.\nI hope To see you back sometime soon!`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCalcelationEmail
}