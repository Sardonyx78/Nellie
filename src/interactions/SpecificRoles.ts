import { GuildMember,MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import _ from "lodash";
import { client } from "../structures/Client";
import { Config } from "../structures/Config";
import { InteractionApp } from "../structures/InteractionApp";
import { specificRolesMessage } from "./SummonSpecificRoles";

const SpecificRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">, GuildMember>("SpecificRolesInteraction")

SpecificRolesInteraction.handle = async (interaction) => {
     const member = (interaction.member as GuildMember)
     const role = interaction.customId.split("-")[1]

     const other = client.interactionCache.get(interaction.message.id) as MessageComponentInteraction

     const components = SpecificRolesInteraction.createInstance(interaction.member as GuildMember)

     if (!member.roles.cache.has(role)) {
          member.roles.add(role)
          interaction.reply({
               ephemeral: true
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          }).catch(() => {})

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SUCCESS)
     }
     else {
          member.roles.remove(role)

          interaction.reply({
               ephemeral: true
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          }).catch(() => {})

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SECONDARY)
     }

     other.editReply({...specificRolesMessage, components})
}

SpecificRolesInteraction.createInstance = (member) => {
     const buttons = [{
          label: "Spoilery Chat",
          value: Config.roles.specific.spoilers,
          emoji: "👀",
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
     }].map(x => new MessageButton({
          customId: `SpecificRolesInteraction-${x.value}`,
          style: member.roles.cache.has(x.value) ? MessageButtonStyles.SUCCESS : MessageButtonStyles.SECONDARY,
          emoji: x.emoji,
          label: x.label
     }))

     return _.chunk(buttons, 5).map(x => new MessageActionRow().addComponents(x))
}

export default SpecificRolesInteraction