/**
 * JS - @author Pafon22 (twitch e twitter homônimos)
 */

// associar as dependências instaladas
const newrelic = require('newrelic');
const express = require('express');
const apiController = require('./controllers/apiController');
const defaultController = require('./controllers/defaultController');
const MAGO = require('./models/MAGOmodel');
// inicializar app express
const app = express();

// 'END POINT INVÁLIDO!'

app.get('/', function (req, res) {
  res.send('END POINT INVÁLIDO!');
});

const bodyParser = require('body-parser');

// este middleware deve estar acima das routes-handlers!
app.use(bodyParser.json());


// todo o url começado por '/api' chama as rotas em './routes/api'
const routes = require('./routes/api');
app.use('/api', routes);


// error handling middleware
app.use(function (err, req, res, next) {
  console.log(err);
  // 'res.status(422)'->muda o status
  res.status(422).send({ error: err.message });
});

const PORT = process.env.PORT || 5000;
// servidor á escuta em port 5000
// 'process.env.port': caso usemos Heroku
app.listen(PORT, () => {
  console.log('Servidor em execução na porta: ' + PORT);
});

const mongoose = require('mongoose');

// Ligar á B.D.: 'test'->user da BD, ´nnn´->pass
//mongoose.connect('mongodb+srv://test:nnn@nodejscluster-art2k.mongodb.net/test?retryWrites=true');
mongoose.connect('mongodb://magorangotango:tvm4g0db@rpg-shard-00-00.bpwba.mongodb.net:27017,rpg-shard-00-01.bpwba.mongodb.net:27017,rpg-shard-00-02.bpwba.mongodb.net:27017/bancoDeDados?ssl=true&replicaSet=atlas-tyoaok-shard-0&authSource=admin&retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });


// Confirma ligação na consola
mongoose.connection.on('connected', function () {
  console.log('Connected to Database ' + 'bancoDeDados');
});

// Mensagem de Erro
mongoose.connection.on('error', (err) => {
  console.log('Database error ' + err);
});

// Apartir aqui é o TMI
console.log("FERRAMENTAS ESTÃO OK");

const tmi = require('tmi.js');
//const { count } = require('./models/MAGOmodel');
const pafonBotName = 'magorangotango';
const canais = ['magorangotango', 'pafon22', 'tvmago'];
const tokenBot = 'oauth:17lpndi843ut3fskisd6n96igl0snb';

const opts = {
  identity: {
    username: pafonBotName,
    password: tokenBot
  },
  channels: canais
};

// Cria um cliente tmi com  nossas opções
const client = new tmi.client(opts);
//MAGO.create({twitch: "PAFON23"});
//MAGO.findOneAndDelete({ twitch: "PAFON23" }).then(function (mago) {   }).catch();
//MAGO.findOne({twitch: "PAFON22"}).then(function (mago){ console.log(mago.discord);}).catch();

/*function magoDiscord(nick, callback) {
  MAGO.findOne({ twitch: nick }).then(function (err, mago) {
    if (err) {
      console.error(err);
      callback && callback(false);
    }
    callback && callback(true);
    console.log(mago.discord);
  })
}*/

async function criar(nick, channel, user) {
  resp = "/me ";
  try {
    result = await defaultController.criarMago(nick);
    twitch = result.twitch;
    resp += "Mago(a) " + twitch + " adicionado(a) ao Grimório de Dados."
  } catch {
    resp += "Já existe um(a) mago(a) associado(a) a esse nick.";
  }
  if (user != "STREAMELEMENTS") {
    client.say(channel, resp);
  }

}

async function buscar(atb, nick, channel) {
  result = "-";
  resp = "/me "
  try {
    result = await defaultController.buscarMago(nick);
    twitch = result.twitch;
    switch (atb) {
      case "NOME":
        resp += "O nome mágico de " + twitch + " é: " + result.nome;
        break;
      case "DISC":
      case "DISCORD":
        resp += "O discord mágico de " + twitch + " é: " + result.discord;
        break;
      case "NIVEL":
      case "NÍVEL":
      case "LEVEL":
      case "RANK":
        resp += "O rank mágico de " + twitch + " é: " + defaultController.revelarIndex(atb, result.rank);
        break;
      case "HISTORIA":
      case "HISTÓRIA":
        resp += "História de " + twitch + ": " + result.historia;
        break;
      case "RPG":
        rpg = result.rpg;
        resp += "Status do RPG de " + twitch + ": " + defaultController.revelarIndex(atb, rpg);
        break;
      case "PET":
      case "PETNOME":
        pet = result.pet;
        //resp += "O pet mágico de " + result.twitch + " é: " + result.pet[0].animal + " chamado " + result.pet[1].poderes;
        resp += "O pet mágico de " + twitch + " é um(a) " + pet[0].animal + " chamado(a) " + pet[0].nome + "!";
        break;
      case "PODER":
      case "PODERES":
        contaPoder = 0;
        poderes = result.poderes;
        if (defaultController.revelarIndex(atb, poderes[0].nome) != "Nenhum") {
          resp += " @" + twitch;
          while (contaPoder < poderes.length && defaultController.revelarIndex(atb, poderes[contaPoder].nome) != "Nenhum") {
            resp += " ───────────────★──────────────── ";
            resp += " ➣ Poder: " + defaultController.revelarIndex(atb, poderes[contaPoder].nome) + " / Data: " + poderes[contaPoder].data + " / Dado: " + poderes[contaPoder].dado;

            contaPoder++;
          } resp += " ───────────────★──────────────── ";
        } else {
          resp += "@" + twitch + " ainda não possui poderes raros."
        }
        contaPoder = 0;
        break;
      case "ELEMENTO":
      case "ELEMENTOS":
        contaElemento = 0;
        elementos = result.elementos;
        if (defaultController.revelarIndex(atb, elementos[0].nome) != "Nenhum") {
          resp += " @" + twitch;
          while (contaElemento < elementos.length && defaultController.revelarIndex(atb, elementos[contaElemento].nome) != "Nenhum") {
            resp += " ───────────────★──────────────── ";
            if (contaElemento == 0) {
              resp += " ➣ Elemento Principal: " + defaultController.revelarIndex(atb, elementos[contaElemento].nome);
            } else {
              resp += " ➣ Outros Elementos: " + defaultController.revelarIndex(atb, elementos[contaElemento].nome);
            }

            contaElemento++;
          } resp += " ───────────────★──────────────── ";
        } else {
          resp += "@" + twitch + " ainda não domina nenhum elemento."
        }
        contaElemento = 0;
        break;
      case "DUELO":
      case "X1":
        contaX1 = 0;
        x1 = result.x1;
        if (x1[0].inimigo != "0") {
          resp += " @" + twitch;
          //console.log(defaultController.revelarIndex(poderes[0].nome));
          while (contaX1 < x1.length) {
            resp += " ───────────────★──────────────── ";

            resp += " ➣ Inimigo: " + x1[contaX1].inimigo + " / Jogo: " + x1[contaX1].jogo + " / Resultado: " + x1[contaX1].resultado + " / Data: " + x1[contaX1].data;

            contaX1++;
          } resp += " ───────────────★──────────────── ";
        } else {
          resp += "@" + twitch + " ainda não participou de duelos."
        }
        break;


      default:
        resp = "Não foi possível encontrar o mago -undefined";
        break;
    }
  } catch {
    resp += "Não foi possível encontrar o mago. Cadastre-o com !mago @Twitchname";
  }
  client.say(channel, resp);
}


async function deletar(nick, channel) {
  resp = "/me ";
  try {
    result = await defaultController.deletarMago(nick);

    resp += "Mago(a) " + result.twitch + " deletado(a) do Grimório de Dados."
  } catch {
    resp += "Não há nenhum(a) mago(a) associado(a) a esse nick.";
  }
  client.say(channel, resp);
}

async function editar(nick, atb, value, channel) {
  resp = "/me ";
  console.log("0: " + nick + " 1: " + atb + " 2: " + value + " 3: " + channel);
  try {
    result = await defaultController.editarMago(nick, atb, value);
    twitch = result.twitch;
    resp += atb + " de " + twitch + " alterado para " + value;
  } catch {
    resp += "Não há nenhum(a) mago(a) associado(a) a esse nick.";
  }
  client.say(channel, resp);
}

//intercepta mensagem do chat
function mensagemChegou(channel, contexto, mensagem, ehBot) {
  if (ehBot) {
    return; //se for mensagens do nosso bot ele não faz nada
  }
  resp = '/me ';
  user = defaultController.padronizarNick(contexto.username);
  ehComigo = false;
  caps = mensagem.toUpperCase();
  nomeDoComando = caps.split("");
  if (nomeDoComando[0] === "!") {
    nomeDoComando.shift();
    msg = nomeDoComando.join("");
    nomeDoComando = msg.split(" ");
    mensagem = nomeDoComando;
    whisper = "/w Pafon22 " + contexto.username + " precisa de ajuda! Erro: " + mensagem

    if (nomeDoComando[1] != null) {
      temp = defaultController.padronizarNick(nomeDoComando[1]);
      nomeDoComando[1] = temp;
      if (nomeDoComando[2] != null) {
        temp = defaultController.padronizarNick(nomeDoComando[2]);
        nomeDoComando[2] = temp;
      }
    }

    if (defaultController.ehAtributo(nomeDoComando[0]) != -1) {
      ehComigo = false;
      console.log("Eh Atributo: " + nomeDoComando[0]);
      if (nomeDoComando[1] == null) {
        buscar(nomeDoComando[0], user, channel);
        //resp += "Por favor, digite um nome para a busca. Exemplo: !discord @" + contexto.username;
      } else {
        if (nomeDoComando[2] == null) {
          buscar(nomeDoComando[0], nomeDoComando[1], channel);
        } else {
          if (defaultController.ehMod(user) != -1) {
            console.log("Mod " + user + " editou " + nomeDoComando[0] + " de " + nomeDoComando[1]);
            copia = defaultController.removePalavra(msg, 2);
            editar(nomeDoComando[1], nomeDoComando[0], copia, channel);
          } else {
            if (nomeDoComando[1] == user) {
              console.log("Não Mod ( " + nomeDoComando[1] + " ) editou seu próprio " + nomeDoComando[0]);
              switch (nomeDoComando[0]) {
                case "NOME":
                  copia = defaultController.removePalavra(msg, 2);
                  editar(nomeDoComando[1], nomeDoComando[0], copia, channel);
                  break;
                case "DISC":
                case "DISCORD":
                  copia = defaultController.removePalavra(msg, 2);
                  editar(nomeDoComando[1], nomeDoComando[0], copia, channel);
                  break;
                case "HISTORIA":
                case "HISTÓRIA":
                  copia = defaultController.removePalavra(msg, 2);
                  editar(nomeDoComando[1], nomeDoComando[0], copia, channel);
                  break;
                case "PETNOME":
                  copia = defaultController.removePalavra(msg, 2);
                  editar(nomeDoComando[1], nomeDoComando[0], copia, channel);
                  break;
                default:
                  console.log("Não Mod ( " + nomeDoComando[1] + " ) falhou ao editar seu próprio " + nomeDoComando[0]);
                  resp += "Comando inválido ou permitido apenas para MODS."
                  client.say(channel, resp);
                  break;
              }
            }

          }
        }
      }
    }
    else {
      switch (nomeDoComando[0]) {
        case 'CRIAR':
        case 'MAGO':
        case 'OBG':
          if (nomeDoComando[1] != null) {
            criar(nomeDoComando[1], channel, user);
          } else {
            criar(user, channel, user);
          }
          break;
        case 'DELETAR':
          if (nomeDoComando[1] != null) {
            if (defaultController.ehMod(user) != -1) {
              deletar(nomeDoComando[1], channel);
            } else {
            }
          }
          break;
        case 'DADO':
          ehComigo = true;
          if (!Number.isInteger(parseFloat(nomeDoComando[1])) || parseFloat(nomeDoComando[1]) < 1) {
            resp += "Por favor, escolha um valor válido para o dado (apenas números inteiros acima de 0). 🎲"
          }
          else {
            resp += "🎲 " + defaultController.rollDice(nomeDoComando[1]).toString() + " 🎲";
          }
          break;
        case 'ATRIBUTOS':
        case 'ATB':
          ehComigo = true;
          resp += defaultController.menuAtributos();
          break;
        case 'MENU':
        case 'GRIMORIO':
        case 'GRIMÓRIO':
          ehComigo = true;
          resp += defaultController.menu();
          break;
          case 'MENUPODERES':
          case 'MENUPODER':
              ehComigo = true;
              resp += defaultController.menuPoderes();
              break;
          case 'MENUELEMENTOS':
          case 'MENUELEMENTO':
              ehComigo = true;
              resp += defaultController.menuElementos();
              break;
            
        default:
          ehComigo = false;
          console.log(`* Não conheço o comando ${nomeDoComando[0]}`);
          break;
      }
      if (ehComigo) {
        client.say(channel, resp);
      } else {
        console.log("Função assíncrona ou não é comigo!");
      }
    }
  }
};

function entrouNoChatDaTwitch(endereco, porta) {
  console.log(`* Bot entrou no endereço ${endereco}:${porta}`);
};


// Registra nossas funções
client.on('message', mensagemChegou);
client.on('connected', entrouNoChatDaTwitch);
// Connecta na Twitch:
client.connect();