---
title: Blockchain
date: 2021/09/13
description: Uma breve descrição sobre como é feito uma blockchain
tag: web development
author: You
---

<h1>Blockchains</h1>

Em um mundo cheio de palavras engraçadas e **difíceis** temos uma que 
as vezes dão calafrios para muitos devs e pessoas que trabalham com tech: _Blockchain_
<br/>
Para começar uma blockchain ao meu ver pode ser explicada como uma lista ligada exatamente igual aquele meme do better call Saul
<br/>


<div class="tenor-gif-embed" data-postid="5679871" data-share-method="host" data-aspect-ratio="1.78" data-width="100%"><a href="https://tenor.com/view/excited-saul-goodman-better-call-saul-breaking-bad-point-gif-5679871">Excited Saul Goodman GIF</a>from <a href="https://tenor.com/search/excited-gifs">Excited GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>

Nada mais que um "I know i guy who knows a guy" ou seja, conheço alguem que conheçe alguem. Outra forma de ver é como um livro-razão, daqueles bem antigos que se usava e ainda se usa em muitas vendinhas/padarias
<img src="https://www.collinsdictionary.com/images/full/ledger_2595123.jpg?version=4.0.180" alt=" um livro razão"/>

Tá mas e o código? é agora a hora da realidade → esse repo aqui tem um exemplo de blockchain realemente muito simples feito em TS com o Node, usando classes da maneira mais simples e rápida o possivel e o que vamos destrinchar é o
[Projeto](https://github.com/Grubba27/my-shit-coin).
<br/>
<h2>Transaction</h2>
Vou ser bem pratico. Vou falar das 4 classes que temos que compõem o projeto e por fim falarei do caso em uso. O primeiro que iremos falar é o mais simples e o começo de tudo é a transação por si só em termos de código é só esse simples trecho:

```
export default class Transaction {
  constructor(
    public amount: number,
    public payer: string,
    public payee: string
  ) {
  }
  toString(): string  {
    return JSON.stringify(this);
  }
}
```

Esse trecho em TS é bem expressivo e simples, uma transação é feita de um valor(número) a ser pago, um recebedor e sua chave publica, um pagador e chave publica. Possui uma função que será repetida varias vezes que é o toString(), padrão.
<br/>
<h2>Block</h2>
O bloco é a peça fundamental que constroi os nós de uma blockchain, nela teremos alguns detalhes importantes, como o uso da nossa classe Transaction que declaramos anteriormente.


```
import crypto from "crypto";
import Transaction from "./Transaction";

export default class Block {

  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string | null,
    public transaction: Transaction,
    public timeStamp: number = Date.now()
  ) {
  }

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}
```

Além do import de Transaction, é necessario importar a lib que está no Node.js, a Crypto, pois usaremos um algoritimo para criar um [hash](https://www.techtudo.com.br/artigos/noticia/2012/07/o-que-e-hash.html) usando o [SHA256](https://pt.wikipedia.org/wiki/SHA-2), para saber mais eu coloquei link nessas duas palavras diferenciadas que é importante saber antes de continuar.
esse hash é como se fosse a identidade do bloco, que será utilizado no futuro, ele por fim terá uma timeStamp para saber o tempo e poder ser uma verificação no futuro, só pode haver **NOVOS** blocos nunca velhos.
<br/>

<h2>Chain</h2>

Chegamos na parte mais doida, a chain por si só, que é formada por blocos, virando uma blockchain. Piadas a parte segue o código e vamos destrinchar as funções nele distribuidas.

```
import crypto from "crypto";
import Block from "./Block";
import Transaction from "./Transaction";

export default class Chain {
  public static instance = new Chain();
  chain: Block[];

  constructor() {
    this.chain = [new Block(null, new Transaction(1000, 'genesis', 'gabriel'))]
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;
    console.log('mining for prof of work...');
    while (true){
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if (attempt.substr(0 , 4) === '0000') {
        console.log(`Solved: ${solution}`);
        return solution;
      }
      solution += 1;
    }
  }
  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer){
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}
```
Chegamos na parte mais irada, a criação de uma blockchain que é um array de blocos ligados sabendo do anterior direto. Para iniciarmos uma chain temos que fazer sua primeira instancia e quando isso ocorre, temos um evento chamado de Genesis, tipo o da biblia ou quando o banco central imprime mais dinheiro.
O Genesis é só um evento de inicio para dar circulação a moeda. Com essa classe criamos a função de saber quem é o último nó no bloco, e a função de minerar que é uma parte essencial de qualquer criptomoeda, ter alguma forma de provar que a moeda que você usou em uma transação foi não só apenas usada uma vez como também é valida. Nessa função temos um loop true que faz essa validação usando um [hash MD5](https://pt.wikipedia.org/wiki/MD5)
A prova de trabalho tem uma premissa simples que é o essencial a ser feito e entendido uma moeda com prof of work ou prova de trabalho, possui um algoritimo dificil de ser feito/ refeito/ minerado mas facilmente verificavel. Como prova de trabalho o minerador ganha uma parte da moeda como recompensa.
<br/>
Temos por fim a função de adicionar bloco ao objeto, que seria feito com uma validação de prof of work conforme explicado acima

<h2>Wallet</h2>

A carteira como muitos sites tem, é nada mais que alguma forma de te identificar e ao mesmo tempo criptografar sua vida como dono de uma moeda.


```
import crypto from "crypto";
import Transaction from "./Transaction";
import Chain from "./Chain";

export default class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {type: 'spki', format: 'pem'},
      privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    });
    this.publicKey = keypair.privateKey;
    this.privateKey = keypair.privateKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new  Transaction(amount, this.publicKey, payeePublicKey);

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}
```

Nesse trecho temos algo relativamente divertido, além dos imports, temos a criação de uma public e private key. Com elas no nosso constructor usando a lib do crypto, chamamos o uso do algoritimo de criptografia [RSA](https://pt.wikipedia.org/wiki/RSA_(sistema_criptogr%C3%A1fico)) além disso temos o formato [pem](https://qastack.com.br/server/9708/what-is-a-pem-file-and-how-does-it-differ-from-other-openssl-generated-key-file) que é aquele que temos e recebemos para quando vamos guardar keys.<br/>
Com nosso identificador publico e privado, podemos agora enviar dinheiro fazendo assinaturas, deixando seguro baseando-se em criptografia. Cada nova transação cria um novo bloco que afeta a chain como um todo.<br/>
Para desenhar e ficar facil entender o que ocorre no fim: wallet faz uma transação que cria um novo bloco que afeta nossa chain.

<h2>Conclusão </h2>
Para concluir temos nosso index.ts que faz a comprovação do que acabamos de codar e é uma ótima prova de conceito.

```
import Wallet from "./classes/Wallet";
import Chain from "./classes/Chain";


// usage in action

const gabriel = new Wallet();
const jon = new Wallet();
const maria = new Wallet();

gabriel.sendMoney(50, jon.publicKey);
jon.sendMoney(10, maria.publicKey);
maria.sendMoney(5, jon.publicKey);

console.log(Chain.instance);
```
Além dos imports necessarios, com o console log podemos ver como está a instancia da Chain de forma global. <br/>
Cada vez que enviamos dinheiro também é feito uma prova de trabalho para que não seja possivel enviar dinheiro ao mesmo tempo.
Muito obrigado pela atenção e até mais
