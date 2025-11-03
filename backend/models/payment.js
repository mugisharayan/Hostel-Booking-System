
const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const paymentSchema = mongoose.Schema({
    paymentId:{
        type: String,
        required: true,
        unique: true
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId,
                ref :'bookings',
                required: true 
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
                ref :'students',
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
        enum:['mobile_money', 'bank_transfer', 'credit/debit_card']
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
        enum:['pending', 'successful', 'failed', 'refunded'],
        default: 'pending'
    },
    receiptUrl:{
        type:String,
        required: false
    },
    verificationToken:{
        type:String,
        unique:true
    },

    phoneNumber:{
        type: String,
    
    },
    phoneGateway:{
        type: String
   },
   gatewayResponse:{
    type:Object,

   },
})