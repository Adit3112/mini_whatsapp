const express= require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Chat= require('./models/chat.js');
const methodOverride=require('method-override');
const ExpressError= require('./ExpressError');

main()
.then(()=>{
    console.log('connected to database');
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
    
}

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


//defining asyncWrap function

function wrapAsync(fn) {
    return function (req, res, next){
        fn(req,res,next).catch((err) => {
            // console.error(err.name);//optional
            next(err);
        })
    }
}

//root route
app.get('/', (req, res) => {
    res.send('welcome to mini_whatsapp!');
});


//index route
app.get('/chats',wrapAsync(async (req, res) => {
        let chats=await Chat.find();
        // console.log(chats);
        res.render('index.ejs',{chats:chats});
    }

));


//new route
app.get('/chats/new',wrapAsync(async(req,res)=>{
        res.render('new.ejs');

    })
);


//create route
app.post('/chats',wrapAsync(async(req,res,next)=>{
        let {from,to,msg} =req.body;
        let newChat = new Chat({
            from:from,
            to:to,
            msg:msg,
            created_at: new Date(),
        });
        await newChat.save()
        .then((res,req) =>{
            console.log('chat was saved');
        }).catch((err) =>{
            console.log(err);
        });
        
        res.redirect('/chats');
})
);

//edit route,new-show route
app.get('/chats/:id/edit',wrapAsync(async (req, res,next) =>{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat){
            next(new ExpressError(404, "chat not found")) ;//server bnd hora islie explicitly next ko call kro
        }
        res.render('edit.ejs',{chat:chat});
    }
    
));

//update route
app.put('/chats/:id',wrapAsync(async (req, res) =>{
        let {id} = req.params;
        let { msg: newMsg } = req.body;
        // console.log(newMsg);
        let updatedChat=await Chat.findByIdAndUpdate(
            id,
            {
                msg:newMsg,
            },
            {
                runValidators: true,
                new: true
            });
        console.log(updatedChat);
        res.redirect('/chats');
  

}));



//delete route
app.delete('/chats/:id',wrapAsync(async (req,res) =>{
        let {id} = req.params;
        let deletedChat=await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect('/chats');

    }))
//handling validation error
const handleValidationErr = (err) => {
    console.log(err);
    console.log(err.message);

}
app.use((err,req,res,next)=>{
    console.log(err.name);
    console.log(err.message);
    if(err.name ==="castError"){
        console.log('Cast Error here!.');
        next(err);
    };
    if(err.name ==="typeError"){
        console.log('Type Error here!.');
        next(err);
    };
    if(err.name ==="validationError"){
        err=handleValidationErr(err);
    }next(err);
});
//error handling middeleware
app.use((err, req, res, next) => {
    let { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send({ message });
});

app.listen(8080,()=>{
    console.log('Server is running on port 8080');
});