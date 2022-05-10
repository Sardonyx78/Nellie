import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { InteractionApp } from "../../../structures/InteractionApp";
import PingRolesInteraction from "./PingRoles";

const SummonPingRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">>("SummonPingRolesInteraction")
export const pingRolesMessage = {
     embeds: [new MessageEmbed({
          title: "Ping Roles",
          color: 0xc9eb7e,
          description: `These roles will notify you when a specific event is taking place in the server
🔔 - Events
🎖 - Competitions
🎤 - Karaoke`
     })],
     ephemeral: true
}

SummonPingRolesInteraction.handle = (interaction) => {
     interaction.reply({
          components: PingRolesInteraction.createInstance(interaction.member as GuildMember),
          nonce: interaction.id,
          ...pingRolesMessage,
          fetchReply: true
     })
}

SummonPingRolesInteraction.createInstance = () => {
     return [new MessageActionRow().addComponents(new MessageButton().setCustomId("SummonPingRolesInteraction").setStyle(MessageButtonStyles.SECONDARY).setLabel("Show Ping Roles Menu"))]
}

export default SummonPingRolesInteraction