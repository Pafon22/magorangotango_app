/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

 const express = require ('express');
const router = express.Router();
// importa controlador 'apiController.js' da pasta: 
// '../controllers/apiController'
const apiController = require('../controllers/apiController');

// TODO: listar pontos de interesse da BD
router.get('/teste', apiController.teste);
router.get('/mago', apiController.find);

//TODO: adicionar novo ponto de interesse
router.post('/mago/create/:twitch', apiController.create);

// TODO: atualizar ponto de interesse
router.put('/mago/update/:twitch', apiController.update);

// TODO: apagar ponto de interesse
router.delete('/mago/delete/:twitch', apiController.delete);
module.exports = router;