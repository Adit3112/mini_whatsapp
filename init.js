const mongoose = require('mongoose');
const Chat = require('./models/chat.js');
main()
    .then(() => {
        console.log('connected to database');
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

}
let allchats=[
    {
        from: 'akshit',
        to: 'aditi',
        msg: 'hie',
        created_at: new Date()
    },
    {
        from: 'aditi',
        to: 'akshit',
        msg: 'what are you doing?',
        created_at: new Date()
    },
    {
        from: 'akshit',
        to: 'aditi',
        msg: 'Nothing just netflix and chill...',
        created_at: new Date()
    },
    {
        from: 'aditi',
        to: 'akshit',
        msg: 'carry On... brother!',
        created_at: new Date()
    }
];

Chat.insertMany(allchats);