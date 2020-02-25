const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold:{
        type: Boolean,
        default:false
    },

    name:{
        type:String,
        required:true,
        minlength:6,
        maxlength:50
    },

    phoneNumber:{
        type:String,
        required:true
    }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;