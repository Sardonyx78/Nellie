import { GuildMember, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { Config } from "../Structures/Config";
import { InteractionApp } from "../Structures/InteractionApp";
const SpecificRolesInteraction = new InteractionApp<SelectMenuInteraction<"present">>("SpecificRolesInteraction")

SpecificRolesInteraction.handle = (interaction) => {
     const member = (interaction.member as GuildMember)
     const role = interaction.values[0]

     if (!member.roles.cache.has(role)) {
          member.roles.add(role)

          interaction.reply({
               ephemeral: true,
               content: `I gave you the role <@&${role}>! Woof-woof!`
          })
     }
     else {
          member.roles.remove(role)

          interaction.reply({
               ephemeral: true,
               content: `I took the role <@&${role}> from you! Woof-woof!`
          })
     }


}

SpecificRolesInteraction.createInstance = () => {
     return new MessageSelectMenu().addOptions([{
          label: "Spoilery Chat",
          value: Config.roles.specific.spoilers,
          emoji: "👀"
     }, {
          label: "Heartstopper",
          value: Config.roles.specific.heartstopper,
          emoji: "🌿"
     }, {
          label: "Solitaire",
          value: Config.roles.specific.solitaire,
          emoji: "🌧"
     }, {
          label: "This Winter",
          value: Config.roles.specific.thiswinter,
          emoji: "🎄"
     }, {
          label: "Nick and Charlie",
          value: Config.roles.specific.nickNCharlie,
          emoji: "☀"
     }, {
          label: "Radio Silence",
          value: Config.roles.specific.radioSilence,
          emoji: "📻"
     }, {
          label: "I Was Born For This",
          value: Config.roles.specific.iWasBornForThis,
          emoji: "🎸"
     }, {
          label: "Loveless",
          value: Config.roles.specific.loveless,
          emoji: "🎭"
     }].map(x => ({ ...x, description: "Click this role to give yourself" })))
}

export default SpecificRolesInteraction