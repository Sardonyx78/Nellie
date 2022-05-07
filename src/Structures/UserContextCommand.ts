import { UserContextMenuInteraction } from "discord.js";

export class UserContextCommand {
     name: string

     constructor(name: string) {
          this.name = name
     }

     serialize(): any {
          return {
               name: this.name,
               type: 2, // USER_COMMAND
          }
     }

     handle: (interaction: UserContextMenuInteraction) => void
}