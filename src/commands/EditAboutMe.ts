import AboutMeEditModal from "../modals/AboutMeEdit"
import { prisma } from "../structures/Prisma"
import { SlashCommand } from "../structures/SlashCommand"

const EditAboutMeCommand = new SlashCommand("editaboutme", {
     value: "Edit Your About Me Info"
}, [] as const)

EditAboutMeCommand.execute = async (_args, interaction) => {
     const data = (await prisma.aboutMe.findUnique({
          where: {
               userId: BigInt(interaction.user.id)
          }
     })) || { bio: "", pronouns: "" }

     await AboutMeEditModal.send(interaction, data)
}

export default EditAboutMeCommand