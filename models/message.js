let connection = require('../config/db')
let moment = require('../config/moment')

class Message {

    constructor(row) {
        this.row = row
    }

    //permet de créer un enregistrement à partir de contenant de msg
    static create(content, callBack) {
        connection.query('INSERT INTO messages SET content = ?, created_at = ?',[content, new Date()],
            (error,result)=>{
                if (error) throw error;
                //le callback sera exécuté quand on récupère les resultats
                callBack(result);
        })
    }

    static all(callBack) {
        connection.query('SELECT * FROM messages',(err,rows)=>{
            if (err) throw err;
            //callBack(rows);
            callBack(rows.map((row) => new Message(row)));
        })
    }

    static find(id, callBack) {
        //pour les requetes préparées
        //LIMIT pour limiter le nombre d'enregistrement de msg à 1
        connection.query('SELECT * FROM messages WHERE id = ? LIMIT 1',[id],(err,rows)=>{
            if (err) throw err;
            //callBack(rows), renvoie le 1 enregistrement sous forme de msg;
            callBack(new Message(rows[0]));
        })
    }

    get id(){return this.row.id;}
    get content(){return this.row.content;}
    get created_at(){return moment(this.row.created_at);}
}

module.exports = Message
