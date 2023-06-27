const express = require('express')
let app = express()
const router = express.Router()
const mongoose = require('mongoose');


const dbConnection = require('../db/mongo');

const cloudinary = require('cloudinary').v2;
const Pusher = require("pusher");


// nodemailer cofnigurration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'livingasrb007@gmail.com',
        pass: process.env.GMAIL_PASS
    }
});

const { v4: uuidv4 } = require('uuid');
const HTMLPage = require('../schema/htmlPageDataSchema')
const FormMessage = require('../schema/formMessages')


router.post('/addhtmlpage', async (req, res) => {


    try {
        const {
            username,
            professions,
            cover,
            about,
            address,
            resumefile,
            works,
            schools,
            email,
            socialmedialinks,
        } = req.body;
        if (!username) return

        const uniqueId = uuidv4();
        const cleanedUniqueId = uniqueId.replace(/-/g, '');
        const cleanedUsername = username.replace(/\s/g, '')

        const uniqueid = cleanedUsername + cleanedUniqueId

        // if(!cover) cover='cover'

        // Checking for required fields
        if (
            !username ||
            !professions ||
            !about ||
            !address ||
            !email ||
            !socialmedialinks ||
            !socialmedialinks.facebook
        ) {
            return res.status(400).json({
                message: 'All fields are required',
                status: 400,
                meaning: 'badrequest'
            });
        }

        // Create a new HTML page document
        const newHTMLPage = new HTMLPage({
            uniqueid,
            metadescription: about || '',
            username,
            professions,
            cover: cover || 'cover',
            about,
            address,
            resumefile: resumefile || '',
            works: works || [],
            schools: schools || [],
            email,
            socialmedialinks,
        });

        // Save the new HTML page to the database
        const savedHTMLPage = await newHTMLPage.save();

        const newFormMessage = new FormMessage({
            uniqueid
        })

        await newFormMessage.save()


        const mailOptions = {
            from: 'livingasrb007@gmail.com',
            to: email,
            subject: 'Work Request',
            html: `<div style="background-color: #F8FAFC; padding: 32px;">
            <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
              <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 16px;">Thank You for Visiting</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">Dear Mr ${username},</p>
              <p style="font-size: 16px; margin-bottom: 16px;">Thank you for visiting my website.</p>
              <p style="font-size: 16px; margin-bottom: 16px;">I am pleased to inform you that your website has been successfully created. Here are the details:</p>
              <ul style="font-size: 16px; margin-bottom: 16px;">
                <li><strong>Username:</strong> ${username}</li>
                <li><strong>Website URL:</strong> ${process.env.WEBSITE_URL}${uniqueid}</li>
              </ul>
              <p style="font-size: 16px; margin-bottom: 32px;">Feel free to explore the website.</p>
              <p style="font-size: 16px;">If you have any questions or need further assistance, please don't hesitate to contact me.</p>
              <p style="font-size: 16px;">Thank you once again!</p>
              <p style="font-size: 16px;">Best regards,</p>
              <p style="font-size: 16px;">Sajid Aalam</p>
            </div>
          </div>
          `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email received from ${email}`);
        } catch (error) {
            if (error.message.includes("Invalid recipient")) {
                console.log(`Wrong email address: ${email}`);
            } else {
                console.log(error);
            }
        }


        if (savedHTMLPage) {
            res.status(201).json({
                message: 'HTML page added successfully',
                savedHTMLPage,
                status: 201,
                meaning: 'created'
            });
        } else {
            res.status(400).json({
                message: 'Unable to add the HTML page',
                status: 400,
                meaning: 'badrequest'
            });
        }
    } catch (error) {
        res.status(501).json({
            message: error.message,
            status: 501,
            meaning: 'internalerror'
        });
    }
});

router.get('/gethtmlpagedata/:uniqueid', async (req, res) => {

    try {
        const { uniqueid } = req.params;
        const htmldata = await HTMLPage.findOne({ uniqueid: uniqueid })
        // if htmldata is not there, return the whole process without any data
        if (!htmldata) {
            return res.status(400).json({
                message: 'Unable to fetch the htmldata! check your credentials',
                status: 400,
                meaning: 'badrequest'
            })
        }

        res.status(200).json({
            htmldata,
            message: 'htmldata fetched successfully',
            status: 200,
            meaning: 'ok'
        })

    } catch (error) {
        return res.status(501).json({
            message: error.message,
            status: 501,
            meaning: 'internalerror'
        })

    }

})

router.post('/sendformmessage/:uniqueid', async (req, res) => {
    const { uniqueid } = req.params;
    const {sendername,senderemail,sendermessage} = req.body
    try {
        const htmldata = await HTMLPage.findOne({ uniqueid: uniqueid })
        console.log("🚀 ~ file: htmlroutes.js:193 ~ router.post ~ htmldata:", htmldata)
        const formmessage = await FormMessage.findOne({ uniqueid: uniqueid });
        if (!formmessage) {
          return res.status(404).json({ message: 'Contact not found' });
        }
    
        const messageCount = formmessage.messages.length;
        const isExceeded = messageCount > 50;

        if(isExceeded) {
            return res.status(404).json({ message:"messages exceeded" });
        }

        formmessage.messages.push({
            sendername,
            senderemail,
            sendermessage
        })


        await formmessage.save()


        const mailOptions = {
            from: 'livingasrb007@gmail.com',
            to: htmldata.email,
            subject: 'Message From Visitors',
            html: `<div style="background-color: #F8FAFC; padding: 32px;">
            <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
              <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 16px;">New Message</h2>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Name:</strong> ${sendername}</p>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Email:</strong> ${senderemail}</p>
              <p style="font-size: 16px; margin-bottom: 32px;"><strong>Message:</strong> ${sendermessage}</p>
            </div>
          </div>
          `
        }

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email received from ${htmldata.email}`);
        } catch (error) {
            if (error.message.includes("Invalid recipient")) {
                console.log(`Wrong email address: ${htmldata.email}`);
            } else {
                console.log(error);
            }
        }

        return res.status(200).json({ message:"messages sent" });


    
      } catch (error) {
        console.log("🚀 ~ file: htmlroutes.js:236 ~ router.post ~ error:", error)
        res.status(500).json({ message: 'Internal server error' });
      }


})


module.exports = router
