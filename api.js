const express = require('express');
const app = express();

const users = [];
const queue = [];


app.use(express.json());

//recebe nome, e-mail e gênero e retorna id, nome e email e gênero
app.post('/createUser', function(req, res){
    //Não é possível criar mais de um usuário com o mesmo email
    let user = users.filter(user => user.email == req.body.email);
    if(user.length!=0){
        res.status(409).send({id:"email_already_exist", msg:"Esse email já se encontra em uso"});
    } else{
        let {nome, email, genero} = req.body;
        user = {
            id:users.length,
            nome:nome,
            email:email,
            genero:genero.toLowerCase()
        };
        users.push(user);
        res.status(201).json(user);
    }
});


/*recebe o id do usuário a ser adicionado
 à fila e retorna a posição em que ele está na fila.*/
app.post('/addToLine', function(req, res){
    let user = users.find(user => user.id == req.body.id);
    let position = queue.findIndex(user => user.id == req.body.id)+1;
    if(!user){
        res.status(404).json({id:"user_not_found", msg:"Não existe usuário com esse ID"+req.body.id});     
    } else if(position!=0){
        res.status(409).json({id:"already_queue", msg:"Usuário já está na fila", position:position});     
    } else {
        queue.push(user);
        res.status(200).json({posicao:queue.length});
    }
});

//recebe o email e retorna a posição na fila
app.post('/findPosition', function(req, res){
    let position = queue.findIndex(user => user.email == req.body.email)+1;
    res.status(200).json({posicao:position})
})

//retorna nome e posição de todos na fila
app.get('/showLine',function(req,res){
    let usersInQueue = queue.map(user=>(
        {
            nome:user.nome,
            posicao:users.findIndex(user1 => user.id == user1.id)+1
        }
    ))
    res.status(200).json(usersInQueue);
});

app.post('/filterLine',function(req,res){
    let genero = req.body.genero.toLowerCase();
    console.log(genero);
    let usersQueueByGender = queue.filter(users=>users.genero==genero);
    let retorno = usersQueueByGender.map(user=>(
        {
            nome:user.nome, 
            genero:user.genero,
            email:user.email,
            posicao:queue.findIndex(user1=>user.id==user1.id)+1
        }
    ));
    res.status(200).json(retorno);
});

app.delete('/popLine',function(req,res){
    let user = queue.shift();
    if(user){
        res.status(200).json(user);
    } else {
        res.status(404).json({id:"queue_is_empty", msg:"A fila encontra-se vazia"});
    }
})


exports.app = app;