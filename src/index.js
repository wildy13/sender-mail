const nodemailer = require('nodemailer');
const fs = require('fs-extra')
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const directoryPath = './docs';

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
    tls: { rejectUnauthorized: false }
});


async function main() {
    try {
        const data = await fs.readJSON('./data/user.json');
        const dir = await fs.readdir(directoryPath);

        const filteredFiles = dir.map(file => {
            const user = data.employee.find(user => file.includes(user.nik));

            if (user) {
                return {
                    file: `${user.nik}.pdf`,
                    email: user.email
                };
            } else {
                return null;
            }
        });

        const pathDir = path.join(__dirname, '../docs')
        let html = ''
        html += `<div>Test</div>`
        for (const file of filteredFiles) {
            await transporter.sendMail({
                from: `"Test" <${process.env.SENDER}>`,
                to: "example@example.com",
                subject: "Hello",
                html,
                attachments: [
                    {
                        filename: `${file}`,
                        path: `${pathDir}/${file}`,
                        contentType: 'application/pdf'
                    }
                ]
            })
        }

    } catch (error) {
        console.log(error)
    }
}

main();