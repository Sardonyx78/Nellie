import { ClientEvents } from "discord.js";

export class DiscordEvent<E extends keyof ClientEvents> {
     eventName: string

     constructor(eventName: E) {
          this.eventName = eventName
     }

     handle: (...args: ClientEvents[E]) => void
}