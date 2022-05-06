import { MessageComponentInteraction } from "discord.js";
import { client } from "../Structures/Client";
import { DiscordEvent } from "../Structures/DiscordEvent";
import { SlashCommand } from "../Structures/SlashCommand";

const Raw = new DiscordEvent("raw" as any)

Raw.handle = async ({ d, t }) => {
     if (t === "INTERACTION_CREATE" && d.type === 5) {
          const cmd = client.modals.get(d.data.custom_id)
          if (!cmd) return

          const args: Record<string, string> = {}

          for (const obj of d.data.components[0].components) {
               args[obj.custom_id] = obj.value
          }

          cmd.handle(args, new (<any>MessageComponentInteraction)(client, d))
     }
}

export default Raw