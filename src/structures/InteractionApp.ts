import { Interaction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, SelectMenuInteraction } from "discord.js"

type TInstance<T extends Interaction> = (T extends SelectMenuInteraction ? MessageSelectMenu : T extends MessageComponentInteraction ? MessageActionRow : MessageButton)[]

export class InteractionApp<T extends Interaction, K = void> {
     typeName: string
     type: "USER" | "MESSAGE" | "COMPONENT"
     
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     createInstance: (data: K) => TInstance<T> = (data: K) => [new MessageButton().setDisabled(true).setLabel("Unavailable")] as TInstance<T>

     constructor(typeName: string, type: "USER" | "MESSAGE" | "COMPONENT" = "COMPONENT") {
          this.typeName = typeName
          this.type = type
     }

     handle: (interaction: T) => void

}