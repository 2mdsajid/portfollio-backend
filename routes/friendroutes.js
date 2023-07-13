const express = require('express')
const router = express.Router()


// nodemailer cofnigurration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'livingasrb007@gmail.com',
        pass: process.env.GMAIL_PASS
    }
});

const Friends = require('../schema/friendsCardSchema')
const friendrequest = require('../schema/friendRequestSchema')

router.post('/addfriends', async (req, res) => {
    try {
      const { name, institution, firstimpressions, bestmemory, id, image, dob, gallery } = req.body;
  
      // Create a new friend document
      const newFriend = new Friends({
        name,
        institution,
        firstimpressions,
        bestmemory,
        id,
        image,
        dob,
        gallery
      });
  
      // Save the new friend to the database
      const savedFriend = await newFriend.save();
  
      if (savedFriend) {
        res.status(201).json({
          message: 'Friend added successfully',
          savedFriend,
          status: 201,
          meaning: 'created'
        });
      } else {
        res.status(400).json({
          message: 'Unable to add the friend',
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
  
  router.post('/friendrequest', async (req, res) => {
    try {
        const {  name, opinion } = req.body;
        // Checking for required fields
        if ( !name || !message) {
            return res.status(400).json({
                message: 'All fields are required',
                status: 400,
                meaning: 'badrequest'
            });
        }

        // Create a new message document
        const newMessage = new Message({
            name,
            opinion: opinion || ''
        });
        // Save the new message to the database
        const savedMessage = await newMessage.save()
        const mailOptions = {
            from: 'livingasrb007@gmail.com',
            to: process.env.WORK_EMAIL,
            subject: 'Request from Friend',
            html: `<div style="background-color: #F8FAFC; padding: 32px;">
            <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
              <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 16px;">New Message</h2>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Name:</strong> ${name}</p>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Opinion:</strong> ${opinion}</p>
            </div>
          </div>
          `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email received from`);
        } catch (error) {
            if (error.message.includes("Invalid recipient")) {
                console.log(`Wrong email address:`);
            } else {
                console.log(error);
            }
        }

        if (savedMessage) {
            res.status(201).json({
                message: 'Message sent successfully',
                savedMessage,
                status: 201,
                meaning: 'created'
            });
        } else {
            res.status(400).json({
                message: 'Unable to send the message',
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
  
module.exports = router