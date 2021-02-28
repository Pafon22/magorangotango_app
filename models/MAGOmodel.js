/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

 const mongoose = require('mongoose');

 const Schema = mongoose.Schema;

// mago Schema
const MAGOSchema = new Schema({
  twitch: {
    type: String,
    unique: true,
    required: [true, '*Campo obrigatório!']
  },
  discord: {
    type: String,
    default: "0"
  },
  nome: {
    type: String,
    default: "0"
  },
  historia: {
    type: String,
    default: "0"
  },
  rank: {
    type: String,
    default: "1"
  },
  rpg: {
    type: String,
    default: "0"
  },
  pet: {
    type: Object,
    default:
      [{animal: "0", nome: "0"}]
  },
  elementos: {
    type: Array,
    default: [{ nome: "0" },{ nome: "0" },{ nome: "0" },{ nome: "0" }]
  },
  poderes: {
    type: Array,
    default: [{ nome: "0", data: "0", dado: "0" }],
  },
  x1: {
    type: Array,
    default: [{ inimigo: "0", jogo: "0", resultado: "0", data: "0" }]
  },
});

// criar Modelo_mago baseado em magoSchema: 'PontosInteresse'->nome da coleção
const MAGO = mongoose.model('listademagos', MAGOSchema);

//await MAGO.create({twitch: "abc", discord: "def"});
// exportar Modelo_mago
module.exports = MAGO; 
