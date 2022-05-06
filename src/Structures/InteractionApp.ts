import { Interaction, Collection, BaseMessageComponent, MessageButton, MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from "discord.js"

export class InteractionApp<T extends Interaction> {
     typeName: string
     type: "USER" | "MESSAGE" | "COMPONENT"
     
     private __createInstance = () => new MessageButton().setDisabled(true).setLabel("Unavailable") as T extends SelectMenuInteraction ? MessageSelectMenu : MessageButton

     constructor(typeName: string, type: "USER" | "MESSAGE" | "COMPONENT" = "COMPONENT") {
          this.typeName = typeName
          this.type = type
     }

     handle(interaction: T) {

     }

     get createInstance(): () => T extends SelectMenuInteraction ? MessageSelectMenu : MessageButton {
          return () => this.__createInstance().setCustomId(this.typeName)
     }

     set createInstance(val) {
          this.__createInstance = val
     }

}