/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

const apiController = require('./apiController');
const defaultController = require('./defaultController');
const MAGO = require('../models/MAGOmodel');
const atributos = ['NOME', 'HISTORIA', 'HISTÓRIA', 'DISC', 'DISCORD', 'RANK', 'NÍVEL', 'NIVEL', 'LEVEL', 'PODER', 'PODERES', 'RPG', 'ELEMENTO', 'ELEMENTOS', 'PET', 'PETNOME', 'DUELO', 'X1'];
const mods = ['PAFON22', 'TVMAGO', 'MELNERVA', 'STREAMELEMENTS', 'FUSOOO12'];
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

exports.editarMago = async function (nick, atb, value) {
  lowcase = atb.toLowerCase();
  capslock = value.toUpperCase();
  console.log(lowcase + capslock);
  try { magoEdit = await MAGO.findOne({ twitch: nick }); }

  catch { }
  
  return MAGO.findOneAndUpdate({ twitch: nick }, JSON.parse(defaultController.updateOne(lowcase, capslock, magoEdit)));
}
exports.updateOne = function (atb, value, magoEdit) {
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

      return '{"' + atb + '":[{"animal":"' + value + '", "nome":"' + magoEdit.pet[0].nome + '"}]}';
      break;
    case "petnome":
      atb = "pet";
      //console.log('{"' + atb + '":[{"animal":"' + value + '", "nome": ""}]}');
      return '{"' + atb + '":[{"animal":"' + magoEdit.pet[0].animal + '", "nome":"' + value + '"}]}';
      break;
    case "elemento":
    case "elementos":
      tam = 4;
      atb = "elementos";
      jsonText = '{"' + atb + '":[';
      if (magoEdit.elementos[0].nome == "0") {
      } else {
        for (countElementos = 0; countElementos < tam; countElementos++) {
          if (magoEdit.elementos[countElementos].nome != "0") {
            jsonText += '{"nome":"' + magoEdit.elementos[countElementos].nome  + '"}, ';
          }
        }
      }
      jsonText += '{"nome":"' + value + '"}';
      jsonText += ']}';
      
      return jsonText;
      break;

    case "poder":
    case "poderes":
      tam = magoEdit.poderes.length;
      atb = "poderes";
      jsonText = '{"' + atb + '":[';
      if (magoEdit.poderes[0].nome == "0") {
      } else {
        for (countPoderes = 0; countPoderes < tam; countPoderes++) {
          if (magoEdit.poderes[countPoderes].nome != "0") {
            jsonText += '{"nome":"' + magoEdit.poderes[countPoderes].nome + '", "data": "' + magoEdit.poderes[countPoderes].data + '", "dado": "' + magoEdit.poderes[countPoderes].dado + '"}, ';
          }
        }
      }
      jsonText += '{"nome":"' + value + '", "data": "", "dado": ""}';
      jsonText += ']}';
      return jsonText;
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

exports.menuPoderes = function () {
  texto = `⚡ PODERES ⚡ ───────────────★──────────────── `
  texto += "➣ 1 - KARU MAKUTU"
  texto += "⠀➣ 2 - GOLEM KOREUTU"
  texto += "⠀➣ 3 - DESCENDÊNCIA ALIENÍGENA "
  texto += "➣ Exemplo de Uso: '!poder @frangoatirador 3' (Descendência Alienígena adicionada na lista de poderes de @frangoatirador) "
  texto += ` ───────────────★──────────────── `
  return texto;
}

exports.menuElementos = function () {
  texto = `⚡ ELEMENTOS ⚡ ───────────────★──────────────── `
  texto += "➣ 1 - ÁGUA"
  texto += " ➣ 2 - AR "
  texto += " ➣ 3 - FOGO"
  texto += " ➣ 4 - TERRA"
  texto += " ➣ Exemplo de Uso: '!elemento @krakendofifa 2' (Elemento AR adicionado na lista de poderes de @krakendofifa) "
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
