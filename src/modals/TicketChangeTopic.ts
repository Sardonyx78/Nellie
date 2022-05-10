import { MessageModal, MessageModalInput } from "../structures/MessageModal";
import {client} from "../structures/Client";
import {TextChannel} from "discord.js";
import {prisma} from "../structures/Prisma";

const TicketChangeTopicModal = new MessageModal<"topic">("AboutMeEditModal")
     .setTitle("Edit About Me")
     .addInput(new MessageModalInput("topic").setMaxLength(100).setLabel("New Topic").setRequired(true))


TicketChangeTopicModal.handle = async (values, interaction) => {
     interaction.reply({
          ephemeral: true,
          content: `Changed the ticket topic to: \`${values.topic}\`!`
     });

     const ticket = await prisma.ticket.update({
          where: {
               id: interaction.customId.split("-")[1]
          },
          data: {
               topic: values.topic
          }
     });

     (client.channels.cache.get(ticket.id) as TextChannel).setName(values.topic)
}

export default TicketChangeTopicModal