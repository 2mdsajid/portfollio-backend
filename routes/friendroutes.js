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

router.post('/addfriends', async (req, res) => {
    try {
      const { name, institution, firstimpressions, bestmemory, id, image, dob, gallery } = req.body;
  
      // Create a new friend document
      const newFriend = new Friend({
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
  

  
module.exports = router