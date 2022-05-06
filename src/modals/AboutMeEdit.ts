import { MessageModal, MessageModalInput } from "../Structures/MessageModal";

const AboutMeEditModal = new MessageModal("AboutMeEditModal")
     .setTitle("Edit About Me")
     .addInput(new MessageModalInput("test").setMaxLength(60).setLabel("Pronouns").setPlaceholder("they/them"))

AboutMeEditModal.handle = (values, interaction) => {
     interaction.editReply({
          content: `Updated your About Me! Woof-woof!`
     })
}

export default AboutMeEditModal