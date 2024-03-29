const express = require("express");
const router = express.Router();
const limitermiddleware = require("../public/limiter");

const Message = require("../schema/messagesSchema");
const WorkRequest = require("../schema/workRequestSchema");
const Event = require("../schema/eventSchema");
const Anonymous = require("../schema/anonymousSchema");
const DailyVisitor = require("../schema/dailyUserVisitSchema");
const NewVisitor = require("../schema/newVisitorSchema");

// nodemailer cofnigurration
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "livingasrb007@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/addmessages", limitermiddleware, async (req, res) => {
  try {
    const { rating, name, email, opinion, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
        meaning: "badrequest",
      });
    }
    const newMessage = new Message({
      rating: rating || 0,
      name,
      email,
      opinion: opinion || "",
      message,
    });
    const savedMessage = await newMessage.save();
    const mailOptions = {
      from: "livingasrb007@gmail.com",
      to: process.env.WORK_EMAIL,
      subject: "Message from Your Visitor",
      html: `<div style="background-color: #F8FAFC; padding: 32px;">
            <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
              <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 16px;">New Message</h2>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Name:</strong> ${name}</p>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px; margin-bottom: 8px;"><strong>Opinion:</strong> ${opinion}</p>
              <p style="font-size: 16px; margin-bottom: 32px;"><strong>Message:</strong> ${message}</p>
            </div>
          </div>
          `,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email received`);
    } catch (error) {
      if (error.message.includes("Invalid recipient")) {
        console.log(`Wrong email address`);
      } else {
        console.log(error);
      }
    }

    if (savedMessage) {
      res.status(201).json({
        message: "Message sent successfully",
        status: 201,
        meaning: "created",
      });
    } else {
      res.status(400).json({
        message: "Unable to send the message",
        status: 400,
        meaning: "badrequest",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: error.message,
      status: 501,
      meaning: "internalerror",
    });
  }
});

router.post("/sendanonymous", limitermiddleware, async (req, res) => {
  try {
    const { message, uniqueid } = req.body;
    console.log(
      "🚀 ~ file: pageroutes.js:89 ~ router.post ~ message:",
      message
    );
    // Checking for required fields
    if (!message) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
        meaning: "badrequest",
      });
    }
    const newMessage = new Anonymous({
      uniqueid: "someid",
      message,
    });
    const savedMessage = await newMessage.save();
    const mailOptions = {
      from: "livingasrb007@gmail.com",
      to: process.env.WORK_EMAIL,
      subject: "Anonymous Message",
      html: `<div style="background-color: #F8FAFC; padding: 32px;">
            <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
              <p style="font-size: 16px; margin-bottom: 32px;"><strong>Message:</strong> ${message}</p>
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
        message: "Message sent successfully",
        status: 201,
        meaning: "created",
      });
    } else {
      res.status(400).json({
        message: "Unable to send the message",
        status: 400,
        meaning: "badrequest",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: error.message,
      status: 501,
      meaning: "internalerror",
    });
  }
});

// requests for work
router.post("/getworkrequests", async (req, res) => {
  try {
    const { name, email, phonenumber, description } = req.body;
    if (!name || !email || !phonenumber || !description) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
        meaning: "badrequest",
      });
    }
    const newWorkRequest = new WorkRequest({
      name,
      email,
      phonenumber,
      description,
    });
    const savedWorkRequest = await newWorkRequest.save();
    const mailOptions = {
      from: "livingasrb007@gmail.com",
      to: process.env.WORK_EMAIL,
      subject: "Work Request",
      html: `<div style="background-color: #F8FAFC; padding: 32px;">
        <div style="background-color: #FFFFFF; border-radius: 16px; padding: 32px;">
          <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 16px;">New Work Request</h2>
          <p style="font-size: 16px; margin-bottom: 8px;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 16px; margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 16px; margin-bottom: 8px;"><strong>Phone Number:</strong> ${phonenumber}</p>
          <p style="font-size: 16px; margin-bottom: 32px;"><strong>Description:</strong> ${description}</p>
        </div>
      </div>
      `,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email received`);
    } catch (error) {
      if (error.message.includes("Invalid recipient")) {
        console.log(`Wrong email address`);
      } else {
        console.log(error);
      }
    }
    if (savedWorkRequest) {
      res.status(201).json({
        message: "Request sent successfully",
        status: 201,
        meaning: "created",
      });
    } else {
      res.status(400).json({
        message: "Unable to send the request",
        status: 400,
        meaning: "badrequest",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: error.message,
      status: 501,
      meaning: "internalerror",
    });
  }
});

// events
router.post("/addevents", async (req, res) => {
  try {
    const { yr, mon, day, src, title, desc } = req.body;
    if (!yr || !mon || !day || !title || !desc) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
        meaning: "badrequest",
      });
    }
    const newEvent = new Event({
      yr,
      mon,
      day,
      src: src | "",
      title,
      desc,
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();
    if (savedEvent) {
      res.status(201).json({
        message: "Event added successfully",
        status: 201,
        meaning: "created",
      });
    } else {
      res.status(400).json({
        message: "Unable to add the event",
        status: 400,
        meaning: "badrequest",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: error.message,
      status: 501,
      meaning: "internalerror",
    });
  }
});

// add visitors
router.get("/addvisitor/:path", async (req, res) => {
  try {
    const { path } = req.params;

    const currentDate = new Date(); // Reset time to midnight
    const isoDate = new Date(currentDate).toISOString();
    const yearMonthDay = isoDate.slice(0, 10); // Extract the first 10 characters (YYYY-MM-DD)

    let dailyvisit = await DailyVisitor.findOne({ date: yearMonthDay });
    if (dailyvisit) {
      dailyvisit.count++;
    } else {
      dailyvisit = new DailyVisitor({ date: yearMonthDay, count: 1 });
    }
    await dailyvisit.save();

    let newVisitor = await NewVisitor.findOne({ path: path });
    if (newVisitor) {
      const visit = newVisitor.values.find(
        (item) => item.date === yearMonthDay
      );
      if (visit) {
        visit.count++;
      } else {
        newVisitor.values.push({ count: 1, date: yearMonthDay });
      }
    } else {
      newVisitor = new NewVisitor({
        path: path,
        values: [{ count: 1, date: yearMonthDay }],
      });
    }

    await newVisitor.save();
    res.status(201).json({
      message: "visitor added ",
      status: 201,
      meaning: "created",
    });
  } catch (error) {
    return res.status(501).json({
      message: error.message,
      status: 501,
      meaning: "internalerror",
    });
  }
});

module.exports = router;
