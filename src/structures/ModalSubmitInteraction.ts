// https://github.com/discordjs/discord.js/blob/5748dbe08783beb80c526de38ccd105eb0e82664/packages/discord.js/src/structures/ModalSubmitInteraction.js

import { Client, Interaction, MessageComponentInteraction } from "discord.js";

export class ModalSubmitInteraction extends Interaction {
     customId: string;
     deferred: boolean;
     replied: boolean;
     ephemeral: boolean;

     constructor(client: Client, data: any) {
          super(client, data);
          /**
           * The custom id of the modal.
           * @type {string}
           */
          this.customId = data.data.custom_id;

          /**
           * Whether the reply to this interaction has been deferred
           * @type {boolean}
           */
          this.deferred = false;

          /**
           * Whether this interaction has already been replied to
           * @type {boolean}
           */
          this.replied = false;

          /**
           * Whether the reply to this interaction is ephemeral
           * @type {?boolean}
           */
          this.ephemeral = null;
     }

     // These are here only for documentation purposes - they are implemented by InteractionResponses
     /* eslint-disable @typescript-eslint/no-empty-function */
     deferReply: MessageComponentInteraction["deferReply"]
     reply: MessageComponentInteraction["reply"]
     fetchReply: MessageComponentInteraction["fetchReply"]
     editReply: MessageComponentInteraction["editReply"]
     deleteReply: MessageComponentInteraction["deleteReply"]
     followUp: MessageComponentInteraction["followUp"]
     deferUpdate: MessageComponentInteraction["deferUpdate"]
     update: MessageComponentInteraction["update"]
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("discord.js/src/structures/interfaces/InteractionResponses.js").applyToClass(ModalSubmitInteraction, "showModal")