// const { ViewModuleSharp } = require("@material-ui/icons");
const mongoose = require("mongoose")

// DeprecationWarning:
mongoose.set('strictQuery', true)

const DB = `mongodb+srv://2mdsajid:${process.env.MONGO_KEY}@cluster0.pkqzjin.mongodb.net/portfolio?retryWrites=true`

mongoose.connect(DB).then(()=>{
    console.log('connected successfully to portfolio database');
}).catch((err)=>{console.log('error while connecting to portfolio database')})

module.exports = mongoose.connection;

// &w=majorityv == remove if majority write error comes


// mongoimport --uri mongodb+srv://2mdsajid:UDkWosAVB0rbfpzh@cluster0.qzob3kp.mongodb.net/med-loc-1 --collection chemistries --type json --file "C:\Users\sajid aalam\Downloads\chem.json" --jsonArray


