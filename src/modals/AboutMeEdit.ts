import { MessageModal, MessageModalInput, MessageModalInputStyle } from "../structures/MessageModal";
import { prisma } from "../structures/Prisma";

const AboutMeEditModal = new MessageModal<"pronouns" | "bio">("AboutMeEditModal")
     .setTitle("Edit About Me")
     .addInput(new MessageModalInput("pronouns").setMaxLength(60).setLabel("Pronouns").setPlaceholder("they/them"))
     .addInput(new MessageModalInput("bio").setMaxLength(255).setStyle(MessageModalInputStyle.Paragraph).setLabel("Bio").setPlaceholder("Hi..."))


AboutMeEditModal.handle = async (values, interaction) => {
     interaction.reply({
          content: `Updated your About Me! Woof-woof!`,
          ephemeral: true
     })

     await prisma.aboutMe.upsert({
          where: {
               userId: BigInt(interaction.user.id)
          },
          create: {
               userId: BigInt(interaction.user.id),
               bio: values.bio || "",
               pronouns: values.pronouns || "",
          },
          update: {
               bio: values.bio || "",
               pronouns: values.pronouns || "",
          }
     })
     prisma.$disconnect()
}

export default AboutMeEditModal