import { client } from "./Client";
import { ModalSubmitInteraction } from "./ModalSubmitInteraction";

export enum MessageModalInputStyle {
     Short = 1,
     Paragraph = 2
}

export class MessageModalInput {
     label: string
     placeholder?: string
     customId?: string
     required = false
     minLength?: number
     maxLength?: number
     value?: string
     style: MessageModalInputStyle = MessageModalInputStyle.Short
     type = 4

     constructor(customId: string) {
          this.customId = customId
     }

     setLabel(label: string) {
          this.label = label
          return this
     }

     setPlaceholder(placeholder?: string) {
          this.placeholder = placeholder
          return this
     }

     setRequired(required: boolean) {
          this.required = required
          return this
     }

     setMinLength(len?: number) {
          this.minLength = len
          return this
     }

     setMaxLength(len?: number) {
          this.maxLength = len
          return this
     }

     setValue(value?: string) {
          this.value = value
          return this
     }

     setStyle(style: MessageModalInputStyle) {
          this.style = style
          return this
     }

     serialize(value?: string) {
          return {
               type: 4,
               custom_id: this.customId,
               style: this.style,
               label: this.label,
               min_length: this.minLength,
               max_length: this.maxLength,
               required: this.required,
               value: value || this.value,
               placeholder: this.placeholder
          }
     }
}

export class MessageModal<T extends string> {
     title: string
     inputs: MessageModalInput[] = []
     custom_id?: string

     constructor(custom_id: string) {
          this.custom_id = custom_id
     }

     setTitle(title: string): this {
          this.title = title
          return this
     }

     addInput(inp: MessageModalInput): this {
          this.inputs.push(inp)
          return this
     }

     async send(interaction: any, prefilledInfo: Record<T, string> = {} as any, extraData?: string) {
          await (<any>client).api.interactions(interaction.id, interaction.token).callback.post({
               data: {
                    type: 9,
                    data: {
                         title: this.title,
                         custom_id: this.custom_id + (extraData ? "-" + extraData : ""),
                         components: this.inputs.map(x => ({
                              components: [x.serialize(prefilledInfo[x.customId as T])],
                              type: 1
                         }))
                    }
               },
               auth: false
          });
     }

     handle: (components: Record<T, string>, interaction: ModalSubmitInteraction) => void
}