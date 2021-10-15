---
title: VSCode
date: 2021/10/14
description: Um exemplo prático de como é criar uma extensão no VSCode 
tag: web development , VSCode
author: You
---
<h1>VSCode Extensions</h1>

Estamos sempre usando nosso queridinho VSCode mas nunca pensamos do que ele é feito, como ele roda. A aplicação usa o
JS/TS, em sua _engine_ para que rode e crie esse **Navegador** que por objetivo tem seu maior foco em ser um editor de
texto, leve e prático, uma dessas belezas dele é a criação de suas extenções/plugins.
<br/>

```
    Quando falo de navegador, é sobre como ele roda e como suas API's são acessadas. 
    Vale também sempre ressaltar a importante sobre entender como as engines JS funcionam e iterpretam o código
```


Vou falar desse script aqui que gera o 'Crazy Spacings'
-> [Código no github](https://github.com/Grubba27/crazy-spacings/blob/master/src/extension.ts)
vou quebrar ele por quase que linha por linha, de forma que você entenda e possa criar caso necessario os seus plugins
para melhorar seus dias como dev
<h3> O Início</h3>
```
Quando você abre a paleta de comandos do VSCode e escreve o comando que é descrito no market


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { eventNames } from 'process';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
				
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "crazy-spacings" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('crazy.start', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		vscode.window.showInformationMessage('Crazy time!');

```

Quando abrimos o script temos que fazer esse bind, via API vscode.commands.registerCommand -> ao fazer essa linha, 
registramos esse comando a ser usado na paleta de comandos, vale ressaltar que a API do vscode é extremamente util e facil de ser entendida.

```
 vscode.window.showInformationMessage('mensagem') é o equivalente de um console.log
```
<h3>
Selecionando texto
</h3>
A função de selecionar texto, é feita através da API de vscode.window.activeTextEditor.document, tendo essa variavel, é criado um array, que é preenchido com o valor de cada linha, onde poderá ser feito através de Regex, a analise dessa linha, baseado no retorno de cada linha temos o array que representa o documento do user do seu plugin.

```
const textRange = () => {
			const textEditor = vscode.window.activeTextEditor?.document;
			if (!textEditor) {
				return;
			}
			let linesArray: vscode.TextLine[] = [];
			new Array(textEditor.lineCount).fill(0).forEach((el, index) => {
				el = textEditor.lineAt(index);
				linesArray.push(textEditor.lineAt(index));
			});
			const rangeArray = linesArray.map((item, index) => {
				if (item.isEmptyOrWhitespace) {
					return;
				}
				if (/\S/.test(item.text[1])) {
					return;
				} else {
					return new vscode.Range(item.lineNumber, 0, item.lineNumber, item.firstNonWhitespaceCharacterIndex);
				}

			});
			return rangeArray;
		};

```
<h3>Evento e Callbacks</h3>
O evento, de alterar texto é feito a chamada da api onDidChangeTextDocument passando o evento como parametro **_e_**
no inicio da nossa função de callback, vemos o que recebemos do texto e analisamos ele como um todo e baseado no seus testes poderá ser feito alguma coisa na proxima função
```
	vscode.workspace.onDidChangeTextDocument(function event(e) {
			const changedText = e.contentChanges[0].text;
			const range = textRange();
			if (!range) {
				return;
			}

		if (/\S/.test(changedText) || e.contentChanges[0].rangeLength !== 0) {

			} else {
				const random = randomSpaceNumber(8);
				const randomAddOrSubstr = randomSpaceNumber(10);
				if (randomAddOrSubstr <= 5) {
				
```
<h3>API de editar </h3>
a api de editar é realmente divertida, mas um pouco complicada, é usado a API de activeEditor.edit, passando o builder como parametro e sendo usado para criar novos dados/ editar os dados que já existem e são usados no proprio editor

```
vscode.window.activeTextEditor?.edit((editBuilder) => {
						range.forEach((r) => {
							if (r !== undefined) {
								const spacesValue = r.end.character + random;
								let crazySpaces = ' '.repeat(spacesValue);
								editBuilder.replace(r, crazySpaces);
							}
						});
					});
				} else {
					vscode.window.activeTextEditor?.edit((editBuilder) => {
						range.forEach((r) => {
							if (r !== undefined) {
								const spacesValue = r.end.character - random;
								let crazySpaces = ' '.repeat(spacesValue);
								editBuilder.replace(r, crazySpaces);
							}
						});
					});
				}
			}
		});

	});
```
<h3>Conclusão</h3>
Visto esse post, podemos ver como que é um pouco complicado mas extremamente recompensador criar essas apis
