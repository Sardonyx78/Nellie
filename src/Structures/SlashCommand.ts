import { APIChannel, APIGuildMember, APIRole } from "discord-api-types/v9"
import _ from "lodash"
import { CommandInteraction, ApplicationCommandOption, User, GuildChannel, ThreadChannel, Role, GuildMember, ChatInputApplicationCommandData } from "discord.js"

interface ITypes {
     "SUB_COMMAND_GROUP": string
     "SUB_COMMAND": string
     "STRING": string
     "INTEGER": number
     "BOOLEAN": boolean
     "USER": User
     "CHANNEL": GuildChannel | ThreadChannel | APIChannel
     "ROLE": Role
     "MENTIONABLE": User | GuildMember | APIGuildMember | Role | APIRole
     "NUMBER": number
}

export type Localization = Record<"da" | "de" | "en-GB" | "en-US" | "es-ES" | "fr" | "hr" | "it" | "lt" | "hu" | "nl" | "no" | "pl" | "pt-BR" | "ro" | "fi" | "sv-SE" | "vi" | "tr" | "cs" | "el" | "bg" | "ru" | "uk" | "hi" | "th" | "zh-CN" | "ja" | "zh-TW" | "ko", string>

type GetArgTypes<TArgs extends ReadonlyArray<ApplicationCommandOption>> = {
     [K in keyof TArgs]: ITypes[TArgs[K]["type"]]
};

export class SlashCommand<TArgs extends ReadonlyArray<ApplicationCommandOption>> {
     name: string
     description: string
     description_localization?: Localization
     arguments: TArgs

     static readonly NiceArgumentNames = { "SUB_COMMAND": "Subcommand", "SUB_COMMAND_GROUP": "Subcommandgroup", "STRING": "String", "INTEGER": "Integer", "BOOLEAN": "Boolean", "USER": "User", "CHANNEL": "Channel", "ROLE": "Role", "MENTIONABLE": "Mentionable", "NUMBER": "Number" } as const

     constructor(name: string, description: { value: string, localization?: Localization }, args: TArgs) {
          this.name = name
          this.arguments = args
          this.description = description.value
          this.description_localization = description.localization
     }

     execute: (args: GetArgTypes<TArgs>, interaction: CommandInteraction) => void

     serialize(): any {
          return {
               name: this.name,
               description: this.description,
               description_localization: this.description_localization,
               //TODO: Bad coding needs fix
               options: this.arguments.map(x => ({...x, type: Object.keys(SlashCommand.NiceArgumentNames).findIndex(y => x.type === y) + 1 })),
               type: 1, // CHAT_INPUT
               default_member_permissions: true
          }
     }

     check(obj: ChatInputApplicationCommandData & { description_localizations?: Localization }): boolean {
          return obj.name === this.name
               && obj.description === this.description
               && obj.options.length == this.arguments.length
               && this.arguments.every((v, i) => _.isEqual(obj.options[i], v))
               && _.isEqual(this.description_localization, obj.description_localizations)
     }
}