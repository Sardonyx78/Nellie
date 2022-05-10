# Contributing

## Opening an issue

## Testing your new features

After cloning the repository you should install the dependencies by using

```shell
$ yarn install
```

You have to create an OAuth application from [Discord Developer Portal](https://discord.com/developers/applications/).
After creating your application create a bot and enable `Server Members Intent` and `Message Content Intent` from
`Privileged Gateway Intents`.


Copy the `.env.example` and rename it to `.env`, fill all variables correspondingly. Run the command below to sync your
db with the current `schema.prisma`.

```shell
$ yarn run sync
```

Copy the `src/config.json` file and rename it to `src/config-dev.json` and change all the values correspondingly with
the ones in your testing Discord server.


And you're done! You can test your changes with the bot.

> If you want to add an entry to the `config.json` and want a value to be added by the maintainers, just write `Fill this in` as the value.

## Committing your changes

This repository follows [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). By default,
the husky git hook should error your commit if your commit message is malformed, but if you have git hooks disabled
it won't. So don't forget to follow [Conventional Commits specifications](https://www.conventionalcommits.org/en/v1.0.0/#specification)

## Setting up your IDE

### VS Code

As the repo uses a dev branch of TypeScript, you have to set it manually to the one installed in `node_modules`.

Open the command palette by `Ctrl/Cmd + Shift + P`. Then choose `Typescript: Select TypeScript version...`

![Command Palette](https://media.discordapp.net/attachments/970433849714675732/973370095634092032/unknown.png)

then select `Use Workspace Version`

![Version Selection](https://media.discordapp.net/attachments/970433849714675732/973371882814472272/unknown.png)