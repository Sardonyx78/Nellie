import { MessageModal, MessageModalInput, MessageModalInputStyle } from "../structures/MessageModal";
import {Config} from "../structures/Config";
import {client} from "../structures/Client";
import {MessageEmbed, TextChannel} from "discord.js";
import SuggestionControls from "../interactions/suggestions/SuggestionControls";

const SuggestionModal = new MessageModal<"title" | "description">("AboutMeEditModal")
     .setTitle("Edit About Me")
     .addInput(new MessageModalInput("title").setMaxLength(100).setLabel("Suggestion Title").setPlaceholder("Add this...").setRequired(true))
     .addInput(new MessageModalInput("description").setRequired(true).setMaxLength(255).setStyle(MessageModalInputStyle.Paragraph).setLabel("Description").setPlaceholder("This should be added cause..."))


SuggestionModal.handle = async (values, interaction) => {
     interaction.reply({
          ephemeral: true,
          content: `Added your suggestion to <#${Config.channels.suggestions}>`
     });

     const suggestions = client.channels.cache.get(Config.channels.suggestions) as TextChannel

     suggestions.send({
          embeds: [new MessageEmbed({
               color: "GOLD",
               title: values.title,
               description: values.description,
               author: {
                    name: `${interaction.user.tag} (${interaction.user.id})`,
                    iconURL: `${interaction.user.avatarURL()}`
               }
          })]
     }).then(msg => {
          suggestions.threads.create({
               startMessage: msg,
               name: values.title,
               autoArchiveDuration: "MAX",
               type: process.env.NODE_ENV === "production" ? "GUILD_PRIVATE_THREAD" : "GUILD_PUBLIC_THREAD"
          }).then(thread => {
               msg.edit({
                    components: SuggestionControls.createInstance(thread.id)
               })
          })
     })
}

export default SuggestionModal