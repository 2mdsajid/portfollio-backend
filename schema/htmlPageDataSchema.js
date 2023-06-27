const mongoose = require('mongoose');

const HtmlPageDataSchema = new mongoose.Schema({
    uniqueid: { type: 'string', required: true, unique: true },
    metadescription: { type: String, required: true },
    username: { type: String, required: true },
    professions: { type: [String], required: true },
    cover: { type: String, required: true },
    about: { type: String, required: true },
    address: { type: String, required: true },
    resumefile: { type: String, default: '' },
    works: [{
        jobinstitution: { type: String, required: true },
        jobrole: { type: String, required: true },
        jobyear: { type: String, required: true },
        jobdescription: { type: String, required: true },
        jobimage: { type: String, default: '' }
    }],
    schools: [{
        schoolinstitution: { type: String, required: true },
        schoollevel: { type: String, required: true },
        classof: { type: String, required: true },
        schooldescription: { type: String, required: true },
        schoolimage: { type: String, default: '' }
    }],
    email: { type: String, required: true },
    socialmedialinks: {
        facebook: { type: String, required: true },
        instagram: { type: String },
        twitter: { type: String },
        youtube: { type: String },
        telegram: { type: String }
    },
});

const HtmlPageData = mongoose.model('HtmlPageData', HtmlPageDataSchema);

module.exports = HtmlPageData;
