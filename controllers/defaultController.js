/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

const apiController = require('./apiController');
const defaultController = require('./defaultController');
const MAGO = require('../models/MAGOmodel');
const atributos = ['NOME', 'HISTORIA', 'HISTÓRIA', 'DISC', 'DISCORD', 'RANK', 'NÍVEL', 'NIVEL', 'LEVEL', 'PODER', 'PODERES', 'RPG', 'ELEMENTO', 'ELEMENTOS', 'PET', 'DUELO', 'X1'];
const mods = ['PAFON22', 'TVMAGO', 'MELNERVA', 'STREAMELEMENTS'];
const elementos = ['Nenhum', 'ÁGUA', 'AR', 'FOGO', 'TERRA'];
const poderes = ['Nenhum', 'KARU MAKUTU', 'GOLEM KOREUTU', 'DESCENDÊNCIA ALIENÍGENA'];
const rpg = ['NÃO ADQUIRIDO', 'ADQURIDO'];
const ranks = ["Civil", "Aspirante a magia", "Aprendiz", "Novato", "Comum", "Encontradiço", "Notável", "Aventureiro", "Primoso", "Magnífico", "Iluminado", "Milagroso", "Glorioso", "Épico", "Mestre", "Esplêndido", "Místico", "Sagrado", "Renomado", "Escomunal", "Magistral", "Divino", "Celeste", "Sábio", "Lendário", "Supremo"];




exports.revelarIndex = function (atb, index) {
  result = "Índice inválido";
  switch (atb) {
    case "RPG":
      if (index >= 0 && index < ranks.length) {
        result = rpg[index];
      }
      break;
    case "NIVEL":
    case "NÍVEL":
    case "LEVEL":
    case "RANK":
      if (index >= 0 && index < ranks.length) {
        result = "Nível " + index + " - " + ranks[index];
      }
      break;

    case "ELEMENTO":
    case "ELEMENTOS":
      if (index >= 0 && index < elementos.length) {
        result = elementos[index];
      }
      break;


    case "PODER":
    case "PODERES":
      if (index >= 0 && index < poderes.length) {
        result = poderes[index];
      }
      break;


    default:
      break;

  }

  return result;
}


exports.ehMod = function (mod) {
  caps = defaultController.padronizarNick(mod);
  index = mods.indexOf(caps, 0);
  if (index != -1) {
    index = caps;
  }
  return index;
}

exports.ehAtributo = function (atb) {
  index = atributos.indexOf(atb, 0);
  if (index != -1) {
    index = atb;
  }
  return index;
}
exports.removePalavra = function (texto, qtd) {
  temp = texto.split(" ");
  for (i = 0; i < qtd; i++)
    temp.shift();
  texto = temp.join(" ");
  return texto;
}

exports.criarMago = function (nick) {
  return MAGO.create({ twitch: nick });
}

exports.buscarMago = function (nick) {
  return MAGO.findOne({ twitch: nick });
}

exports.editarMago = function (nick, atb, value) {
  lowcase = atb.toLowerCase();
  capslock = value.toUpperCase();
  console.log(lowcase + capslock);
  return MAGO.findOneAndUpdate({ twitch: nick }, JSON.parse(defaultController.updateOne(lowcase, capslock)));
}

exports.deletarMago = function (nick) {
  return MAGO.findOneAndDelete({ twitch: nick });
}



exports.rollDice = function (num) {
  return Math.floor(Math.random() * num) + 1;
}

exports.padronizarNick = function (username) {
  caps = username.toUpperCase();
  text = caps.split("");
  if (text[0] == "@") {
    text.shift();
  }
  userPadronizado = text.join('');
  return userPadronizado;
}

exports.updateOne = function (atb, value) {
  switch (atb) {
    case "disc":
      atb = "discord";
      break;
      case "historia":
      case "história":
        atb = "historia";
        break;
    case "level":
    case "nível":
    case "nivel":
      atb = "rank";
      break;
    case "pet":
      //console.log('{"' + atb + '":[{"animal":"' + value + '", "nome": ""}]}');
      return '{"' + atb + '":[{"animal":"' + value + '", "nome": ""}]}';
      break;
    case "elemento":
    case "elementos":
      atb = "elementos";
      //console.log('{"' + atb + '":[{"animal":"' + value + '", "nome": ""}]}');
      return '{"' + atb + '":[{"nome":"' + value + '"}, {"nome":"0"}, {"nome":"0"}, {"nome":"0"}]}';
      break;

    case "poder":
    case "poderes":
      atb = "poderes";
      return '{"' + atb + '":[{"nome":"' + value + '", "data": "", "dado": ""}]}';
      break;
    case "x1":
    case "duelo":
      atb = "x1";
      return '{"' + atb + '":[{"inimigo":"' + value + '", "data": "", "jogo": "", "resultado": ""}]}';
      break;

    default:
      break;
  }
  return '{"' + atb + '":"' + value + '"}';
}

exports.menu = function () {
  text = "⚡ GRIMÓRIO ⚡ ";
  text += "──────────★─VISUALIZAR─★────────── ";
  text += "➣!atributo @User ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀";
  text += "➣Exemplo: ➣!discord @tvmago ";
  text += "──────────★───EDITAR───★───────── ";
  text += "➣!atributo @User VALOR ⠀⠀⠀⠀⠀ ";
  text += "➣Exemplo: ➣!discord @tvmago Mago#1373 ";
  text += "──────────★───EXTRAS───★──────── ";
  text += "➣!mago @radiomago (Cadastrar Mago) ⠀⠀⠀⠀ ";
  text += "➣!menu ➣!atributos ➣!dado VALORMÁXIMO ";
  text += "───────────────★──────────────── ";

  return text;
}
exports.menuAtributos = function () {
  texto = `⚡ ATRIBUTOS ⚡ ───────────────★──────────────── `
  texto += "⠀⠀⠀⠀➣!nome "
  texto += "⠀⠀⠀ ➣!historia "
  texto += "⠀⠀⠀ ➣!discord "
  texto += "⠀⠀⠀⠀➣!rank "
  texto += "⠀⠀⠀⠀ ➣!poderes "
  texto += "⠀⠀⠀➣!rpg "
  texto += "⠀⠀⠀⠀➣!pet "
  texto += "⠀⠀⠀⠀⠀ ➣!elementos "
  texto += "⠀ ➣!x1 "
  texto += ` ───────────────★──────────────── `
  return texto;
}


/*exports.update = function (atributo, nome, valor, next) {
  twitchname = defaultController.padronizarNick(nome);
  MAGO.findOneAndUpdate({ twitch: twitchname },
    JSON.parse(updatOne(atributo, valor))).then(function () {
      MAGO.findOne({ twitch: twitchname }).then(function (mago) {
        updatOne(atributo, valor);
        //res.send(mago);
        return mago;
      });
    }).catch(next);
  };
  */
 // TODO: listar mago da BD
/*exports.findAtb = function (atb, mago) {
  resp = "Não cadastrado.";
  switch (atb) {
    case "DISCORD":
      console.log(magoOBJ);
      break;
      case "nome":
        res.send(mago.nome);
        break;
   case "historia":
     res.send(mago.historia);
     break;
   case "rank":
     res.send(mago.rank);
     break;
   case "rpg":
     res.send(mago.rpg);
     break;
   case "elementos":
     res.send(mago.elementos);
     break;
   case "poderes":
     res.send(mago.poderes);
     break;
   case "pet":
     res.send(mago.pet);
     break;
   case "x1":
     res.send(mago.x);
     break;
   default:
     res.send(mago);
     break;
 }
 return resp;
};
*/
/*
MAGO.findOne({ twitch: twitchname }).then(function (mago) {
    switch (atb) {
        case "DISCORD":
            //resp = "abc";
            resp = mago.discord;
            resp = "abc - entrou no case";
            break;
        default:
            resp = "Não cadastrado.";
            resp = "default";
            break;
    }
})
return resp;
};*/
/*
  case "nome":
    res.send(mago.nome);
    break;
  case "historia":
    res.send(mago.historia);
    break;
  case "rank":
    res.send(mago.rank);
    break;
  case "rpg":
    res.send(mago.rpg);
    break;
  case "elementos":
    res.send(mago.elementos);
    break;
  case "poderes":
    res.send(mago.poderes);
    break;
  case "pet":
    res.send(mago.pet);
    break;
  case "x1":
    res.send(mago.x);
    break;
  default:
    //res.send(mago);
    resp = "atributo inválido";
    break;

}
})
return resp;
};
*/
