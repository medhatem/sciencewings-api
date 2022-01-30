## manaServices server repo

![current version](badges/version.svg) ![typescript](https://img.shields.io/badge/built%20with-typescript-3178C6.svg)

- mana core back-end repository
- mana server and micro-services

## Prerequisites

- [Node and npm](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/)

## Nice to have

[iterm](https://iterm2.com/) for a better terminal experience

# vscode extensions

[eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[prettier code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

[sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports)

## Nice to have Vscode extensions

[todo tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
[Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)
[Error lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

## Getting started

- to get started make sure to fork the repository first

```
git clone `your fork link`
cd api
npm run init
```

- Start the containers `npm run start-containers`.
- If succesfull open a new terminal.
- Run the server `npm run dev`.

- checkout server health: `http://localhost:3000/health`.
- checkout the swagger docs: `http://localhost:3000/api/docs/`.
