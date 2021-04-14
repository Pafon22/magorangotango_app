/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

const MAGO = require('../models/MAGOmodel');
const defaultController = require('./defaultController');

exports.find = function (req, res) {
    atributo = defaultController.padronizarNick(req.query.atb);
    twitchname = defaultController.padronizarNick(req.query.twitch);
    MAGO.findOne({ twitch: twitchname }).then(function (mago) {
      switch (atributo) {
        case "DISCORD":
          res.send(mago.discord);
          break;
        case "RACA":
          res.send(mago.raca);
          break;
        case "NOME":
          res.send(mago.nome);
          break;
        case "HISTORIA":
          res.send(mago.historia);
          break;
        case "RANK":
          res.send(mago.rank);
          break;
        case "RPG":
          res.send(mago.rpg);
          break;
        case "ELEMENTOS":
          res.send(mago.elementos);
          break;
        case "PODERES":
          res.send(mago.poderes);
          break;
        case "PET":
          res.send(mago.pet);
          break;
        case "X1":
          res.send(mago.x);
          break;
        default:
          res.send(mago);
          break;
      }
    })
  };

exports.teste = function (req, res) {
  res.send("Foi");
};

// ocorrido um erro, 'next' chama proximo middleware (ver 'app.js')
exports.create = function (req, res, next) {
  twitchname = defaultController.padronizarNick(req.params.twitch);
  MAGO.create({ "twitch": twitchname }).then(function (mago) {
    res.send(mago);
  }).catch(next);
};


// atualiza 'pi' da BD com as propriedades em 'req.body'
// depois, procura de novo na BD o 'pi' atualizado (senão manda o pi // não atualizado!)
// depois, devolve o 'pi' atualizado ao cliente
exports.update = function (req, res, next) {
  twitchname = defaultController.padronizarNick(req.params.twitch);
  MAGO.findOneAndUpdate({ twitch: twitchname },
    JSON.parse(defaultController.updateOne(req.query.atb, req.query.value))).then(function () {
      MAGO.findOne({ twitch: twitchname }).then(function (mago) {
        defaultController.updateOne(req.query.atb, req.query.value);
        res.send(mago);
      });
    }).catch(next);
};



// '_id:'->nome da propriedade na BD, 
// 'req.params.id'->devolve-me o parametro id na req
exports.delete = function (req, res, next) {
  // apaga 'mago' da BD, depois, devolve o 'mago''' apagado ao cliente
  twitchname = defaultController.padronizarNick(req.params.twitch);
  MAGO.findOneAndDelete({ twitch: twitchname }).then(function (mago) {
    res.send(mago);
  }).catch(next);
};




