import AboutMeCommand from "../../commands/About";
import { UserContextCommand } from "../../structures/UserContextCommand";

const AboutUserContextCommand = new UserContextCommand("About this user")

AboutUserContextCommand.handle = (interaction) => {
     //@ts-expect-error AboutMeCommand has an exception
     AboutMeCommand.execute([interaction.targetUser], interaction, true)
}

export default AboutUserContextCommand