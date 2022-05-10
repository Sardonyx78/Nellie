import {InteractionApp} from "../../structures/InteractionApp"
import {MessageActionRow, MessageButton, MessageComponentInteraction, ThreadChannel} from "discord.js";
import TicketChangeTopicModal from "../../modals/TicketChangeTopic";
import {client} from "../../structures/Client";

const TicketControls = new InteractionApp<MessageComponentInteraction<"present">, string>("TicketControlsInteraction")

TicketControls.handle = async (interaction) => {
     const cmds = interaction.customId.split("-")

     if (cmds[1] === "topic") TicketChangeTopicModal.send(interaction, { topic: undefined }, cmds[2])
     else if (cmds[1] === "archive") {
          await interaction.reply({
               ephemeral: true,
               content: "Archiving.."
          });
          (await <Promise<ThreadChannel>>client.channels.fetch(cmds[2])).setArchived(true)
     }
}

TicketControls.createInstance = (id) => {
     return [new MessageActionRow().setComponents(
          new MessageButton({
               customId: `TicketControlsInteraction-topic-${id}`,
               label: "Change the topic",
               style: "PRIMARY"
          }),
          new MessageButton({
               customId: `TicketControlsInteraction-archive-${id}`,
               label: "Archive thread",
               style: "DANGER"
          })
     )]
}

export default TicketControls