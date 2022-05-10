import {
     GuildMember,
     MessageActionRow,
     MessageButton,
     MessageComponentInteraction,
     ThreadChannel
} from "discord.js"
import {client} from "../../structures/Client"
import {InteractionApp} from "../../structures/InteractionApp"
import CreateSuggestion from "../../modals/CreateSuggestion";

const SuggestionControls = new InteractionApp<MessageComponentInteraction<"present">, string>("SuggestionControlsInteraction")

SuggestionControls.handle = async (interaction) => {
     const cmds = interaction.customId.split("-")

     if (cmds[1] === "create")
          await CreateSuggestion.send(interaction)
     else if (cmds[1] === "join") {
          const thread = client.channels.cache.get(cmds[2]) as ThreadChannel

          interaction.reply({
               content: `Added you to <#${thread.id}>`,
               ephemeral: true
          })

          await thread.members.add(interaction.member as GuildMember)
     }
}

SuggestionControls.createInstance = (id) => {
     return [new MessageActionRow().setComponents(
          new MessageButton()
               .setCustomId(`SuggestionControlsInteraction-join-${id}`)
               .setLabel("Join the discussion")
               .setStyle("PRIMARY"),
          new MessageButton()
               .setCustomId("SuggestionControlsInteraction-create")
               .setLabel("Create a suggestion")
               .setStyle("SECONDARY"))]
}

export default SuggestionControls