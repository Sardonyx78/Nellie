import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { client } from "../structures/Client";
import { InteractionApp } from "../structures/InteractionApp";
import SpecificRolesInteraction from "./SpecificRoles";

const SummonSpecificRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">>("SummonSpecificRolesInteraction")
export const specificRolesMessage = {
     embeds: [new MessageEmbed({
          title: "Specific Roles",
          color: 0xc9eb7e,
          description: `👀 - okay with spoilers (access to <#482881827779117056>)
🌿 - Heartstopper
🌧 - Solitaire
🎄 - This Winter
☀ - Nick and Charlie
📻 - Radio Silence
🎸 - I Was Born For This
🎭 - Access to LOVELESS chat`
     })],
     ephemeral: true
}

SummonSpecificRolesInteraction.handle = async (interaction) => {
     await interaction.reply({
          components: SpecificRolesInteraction.createInstance(interaction.member as GuildMember),
          nonce: interaction.id,
          ...specificRolesMessage,
          fetchReply: true
     }).then(x => {
          client.interactionCache.set(x.id, interaction)
     })
}

SummonSpecificRolesInteraction.createInstance = () => {
     return [new MessageActionRow().addComponents(new MessageButton().setCustomId("SummonSpecificRolesInteraction").setStyle(MessageButtonStyles.SECONDARY).setLabel("Show Special Roles Menu"))]
}

export default SummonSpecificRolesInteraction