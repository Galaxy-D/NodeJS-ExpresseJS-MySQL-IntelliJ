/*
    à chaque fois qu'on fait une modification on est obligé de relancer le serveur
    il y a un autre outil qui s'appel nodemon qui va nous permettre de redemarrer notre serveur
    automatiquement à chaque modification de fichier ce qui est plus partique lors de la phase de dev
*/
//let app = require('express')()
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//ici on charge express
let express = require('express')
let app = express()

//permet de formatter les données de request et les afficher
//il faut faure attention et mettre les middlewares des session avant les middleware des flash
let bodyParser = require('body-parser')

let session = require('express-session')

//ejs est le moteur de template
app.set('view engine','ejs')

//il faut dire a expresse js de délivrer (distribuer) les fichiers static (ex: css) sans besoin de gérer les routes manuellement
//app.use(express.static('public'))
//<link rel="stylesheet" href="/semantic/semantic.min.css">

//middleware (ex: avec les middleware on peut gérer les msg flash) permettent d'analyse des données qui rentrent (request) et puis modifier les data si besoin

app.use('/assets',express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
    secret: 'clesecretepourchiffrenotrecookie',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
}))

//middleware
app.use(require('./middlewares/flash'))

//our routes

//ici on gère notre routing et rendre la page html
app.get('/',(request, response)=>{
    //response.send('salam wa 3likom')
    //pour rendre une vue on utilise à la place de send la méthode render
    //response.render('pages/index', {test: 'salut'})
    //console.log(request.session.error)
    /*
    if(request.session.error) {
        response.locals.error = request.session.error
        //ici on supprime la variable des qu'on aurait fini à l'utiliser
        request.session.error = undefined
    }
    console.log(request.session)
    response.render('pages/index')
    */

    let Message = require('./models/message')
    //allow us to recover all messages
    Message.all((messages)=>{
        //we render the page just when we have got the messages and send the msg like (variable local)
        response.render('pages/index', {messages: messages})
    })

})

app.get('/message/:id', (request, response)=>{
    let Message = require('./models/message')
    //pour récupérer l'id
    Message.find(request.params.id, (message)=>{
        response.render('message/show',{message:message})
    })
})

app.post('/',(request, response)=>{
    //console.log(request)
    //console.log(request.body)
    if (request.body.message === undefined || request.body.message === ''){
        //response.render('pages/index', {error: "😑 ! Veuillez écrire un msg svp 😊"})
        //pour stocker un msg d'erreur
        //request.session.error = "😑 ! Veuillez écrire un msg svp 😊"
        request.flash('error',"😑 ! Veuillez écrire un msg svp 😊")
        //pour redériger un utilisateur
        response.redirect('/')
    } else {
        let Message = require('./models/message')
        Message.create(request.body.message, ()=>{
            request.flash('success',"thanks for your message 😉 !")
            response.redirect('/')
        })
    }
})

//ici on ecoute sur le port 8080
app.listen(8080)



