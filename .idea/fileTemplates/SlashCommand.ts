import { SlashCommand } from "../structures/SlashCommand"

const ${COMMAND_NAME} = new SlashCommand("example", {
     value: "description"
}, [] as const)

${COMMAND_NAME}.execute = async (args, interaction) => {

}

export default ${FILE_NAME}Command