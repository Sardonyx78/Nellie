import { GuildMember,MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import _ from "lodash";
import { Config } from "../../../structures/Config";
import { InteractionApp } from "../../../structures/InteractionApp";
import { pingRolesMessage } from "./SummonPingRoles";

const PingRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">, GuildMember>("PingRolesInteraction")

PingRolesInteraction.handle = async (interaction) => {
     const member = (interaction.member as GuildMember)
     const role = interaction.customId.split("-")[1]

     const components = PingRolesInteraction.createInstance(interaction.member as GuildMember)

     if (member.roles.cache.has(role)) {
          member.roles.remove(role)

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SECONDARY)
     } else {
          member.roles.add(role)

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SUCCESS)
     }

     await interaction.update({...pingRolesMessage, components})
}

PingRolesInteraction.createInstance = (member) => {
     const buttons = [{
          label: "Events",
          value: Config.roles.ping.events,
          emoji: "🔔"
     }, {
          label: "Competitions",
          value: Config.roles.ping.competitions,
          emoji: "🎖"
     }, {
          label: "Karaoke",
          value: Config.roles.ping.karaoke,
          emoji: "🎤"
     }].map(x => new MessageButton({
          customId: `PingRolesInteraction-${x.value}`,
          style: member.roles.cache.has(x.value) ? MessageButtonStyles.SUCCESS : MessageButtonStyles.SECONDARY,
          emoji: x.emoji,
          label: x.label
     }))

     return _.chunk(buttons, 5).map(x => new MessageActionRow().addComponents(x))
}

export default PingRolesInteraction