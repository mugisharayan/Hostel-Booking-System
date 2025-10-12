
const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const paymentSchema = mongoose.Schema({
    paymentId:{
        type: String,
        required: trusted,
        unique: true
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId,
                ref :'bookings',
                required: true 
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
                ref :'users',
                required: true 
    },
    amount:{
        type:Number,
        required: true,
        min: 0
    },
    currency:{
        type: String,
        default: 'UGX'
    },
    paymentMethod:{
        type: String,
        required: true,
        enum:['mobile_money', 'bank_transfer', 'credit/debit_card', 'master_card']
    },
    transactionId:{
        type: String,
        required: true,
        unique: true
    },
    paymentDate:{
        type: Date,
        default: Date.now
        
    },
    status:{
        type:String,
        required: true,
        enum:['pending', 'successful', 'failed', 'refunded']
    },
    phoneNumber:{
        type: String,
    
    },
    phoneGateway:{
        type: String
   }
})