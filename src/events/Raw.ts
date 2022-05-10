import { client } from "../structures/Client";
import { DiscordEvent } from "../structures/DiscordEvent";
import { ModalSubmitInteraction } from "../structures/ModalSubmitInteraction";

const Raw = new DiscordEvent("raw" as any)

Raw.handle = async ({ d, t }) => {
     if (t === "INTERACTION_CREATE" && d.type === 5) {
          const cmd = client.modals.get(d.data.custom_id.split("-")[0])
          if (!cmd) return

          const args: Record<string, string> = {}

          for (const comp of d.data.components) {
               const obj = comp.components[0]
               args[obj.custom_id] = obj.value
          }

          cmd.handle(args, new ModalSubmitInteraction(client, d))
     }
}

export default Raw