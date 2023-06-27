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

/* PUSHER--------- */
// const pusher = new Pusher({
//     appId: "1573280",
//     key: process.env.PUSHER_KEY,
//     secret: process.env.PUSHER_SECRET,
//     cluster: "ap2",
//     useTLS: true
// });

// CLOUDINARY Configuration 
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

/* MULTER  */
// Importing necessary libraries
const multer = require('multer')
const fse = require('fs-extra')
const path = require('path');

// Setting the directory where the files will be stored
const DIR = './public/';


// Function to configure the storage settings for Multer
const setDirectory = () => {

    console.log('multer begins')

    const uploadDir = `${DIR}uploads/`
    fse.ensureDir(uploadDir);

    // Setting the destination and filename for the uploaded files
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Setting the directory to store the uploaded files
            cb(null, DIR + 'uploads/');
        },
        filename: (req, file, cb) => {
            // Setting the filename to the original filename of the uploaded file
            cb(null, file.originalname)
        }
    });

    // Configuring Multer with the storage settings and file filter
    return multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            // Checking if the uploaded file is a valid image, audio, or video file
            if (
                ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.mimetype) ||
                ['audio/mpeg', 'audio/wav', 'audio/mp3'].includes(file.mimetype) ||
                ['video/mp4', 'video/mpeg', 'video/quicktime'].includes(file.mimetype)
            ) {
                cb(null, true);
            } else {
                cb(new Error('Only .png, .jpg, .jpeg, .webp, .mp3, .wav, .mp4, and .mov formats allowed!'));
            }
        }
    });
}
const upload = setDirectory()


// Define a route for saving the images, which accepts a file upload of up to 15 files using multer.
router.post('/saveimages', upload.array('images', 15), async (req, res) => {

    let imageurls = [] //to store the URLs
    // const { captions, sources } = req.body

    try {

        // Move each uploaded file to the new directory and generate URLs for each file
        const images = await Promise.all(req.files.map(async (file, index) => {

            // CLOUDINARY IMAGES UPLOAD-----------------------------
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'notes',
                transformation: [
                    { width: 800, height: 600, crop: 'fill', aspect_ratio: '4:3' }
                ]
            });

            const imgurl = result.secure_url;

            // const imgurl = 'anurl';

            // creating a name to put in the blog during entry -  to be parsed with image urls later on render
            const img = `_root_i_${index + 1}`



            const image = {
                image: imgurl || '',
                caption: '',
                source: '',

            }

            imageurls.push(image)
            await fse.unlink(file.path);
        }
        ));
        if (imageurls.length === req.files.length) {
            return res.status(201).json({
                message: 'Note addded successfully',
                status: 201,
                imageurls,
                meaning: 'created'
            });
        } else {
            return res.status(501).json({
                message: 'images were not uploaded properly',
                status: 501,
                meaning: 'internalerror'
            })
        }


    } catch (error) {
        res.status(501).json({
            message: error.message,
            status: 501,
            meaning: 'internalerror'
        })
    }
})




module.exports = router
