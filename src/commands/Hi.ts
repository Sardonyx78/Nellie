import { SlashCommand } from "../Structures/SlashCommand"

const HiCommand = new SlashCommand("hi", {
     value: "Nellie Says Hi"
}, [{
     name: "msg",
     type: "STRING",
     description: "Extra message to say"
}] as const)

HiCommand.execute = (args, interaction) => {
     interaction.reply({
          content: `Hello <@!${interaction.user.id}>! ${args[0]}`
     })
}

export default HiCommand