const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const validateToken = require('./utils')
/**
 * Declaramos las variables de express.
 */
const app = express();
const routes = express.Router();
//Defino el array donde vamos a persistir los datos:
let students = [
    {
        id: 1,
        name: 'Lucas',
        lastname: 'Pratto'
    },
    {
        id: 2,
        name: 'Diego',
        lastname: 'Garcia'
    },
    {
        id: 3,
        name: 'Pablo',
        lastname: 'Perez'
    }
]
// Declaramos los middlewares:

/*Cors es un middleware de seguridad. Sirve para indicar desde que urls se puede acceder a nuestro servidor.
* En este caso, le pasamos el comodín * que sirve para indicar que desde cualquier url pueden ingresar.
*/
app.use(cors('*'))
// Morgan es un middleware de desarrollo. Nos permite logear las peticiones http que recibe el servidor.
app.use(morgan('dev'));
//Aclaramos que queremos enviar y recibir json
app.use(express.json())




//Definimos las rutas:
app.get('/', (_, res) => res.send('Servidor para testeo de Postman'));
//¿Qué se imaginan que pasa aca?
app.use('/api', validateToken, routes);

//Defino las rutas de los métodos del CRUD
routes.get('/students', (_, res) => {
    res.status(200).json(students);
});

routes.get('/student/:id', (req, res) => {
    const student = students.filter(a => a.id === Number(req.params.id));
    student.length > 0 ? res.status(200).json(student) : res.status(404).json({error_message: "The id does not exist"});
});

routes.put('/student/:id', (req, res) => {
    const student = students.filter(a => a.id === Number(req.params.id));
    students[student[0].id-1] = {id: student[0].id, name: req.body.name, lastname: req.body.lastname};
    student.length > 0 ? res.status(200).json(students[student[0].id-1]) : res.status(404).json({error_message: "The id does not exist"})
});

routes.post('/student', (req, res) => {
    try{
        const idStudent = students[students.length-1].id+1
        students.push({id: idStudent, ...req.body});
        res.status(201).json({message: 'Student created successfully'})
    } catch (err) {
        res.json({error_message: "Error in posting new student"})
    }
})

routes.delete('/student/:id', (req, res) => {
    const deleteStudents = students.filter(student => student.id != req.params.id);
    students = deleteStudents;
    students.length >= req.params.id ? res.status(200).json({message: "Student successfully eliminated"}) : res.status(404).json({error_message: "The id does not exist"})
})



//Finalmente iniciamos el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Server listening http://localhost:8080');
});

