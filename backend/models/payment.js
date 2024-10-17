const mongoose = require('mongoose');  

const paymentSchema = new mongoose.Schema({  
    userId: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user', // Reference to User model  
        required: true,  
    },  
    amount: {  
        type: Number,  
        required: true,  
    },  
    currency: {  
        type: String,  
        required: true,  
    },  
    provider: {  
        type: String,  
        required: true,  
    },  
    accountInfo: {  
        recipientAccount: {  
            type: String,  
            required: true,  
        },  
        swiftCode: {  
            type: String,  
            required: true,  
        },  
    } 
});  
module.exports = mongoose.model('Payment', paymentSchema);   
