import { InteractionApp } from "../../structures/InteractionApp"

const ${INTERACTION_NAME} = new InteractionApp<MessageComponentInteraction<"present">, string>("${INTERACTION_NAME}Interaction")

${INTERACTION_NAME}.handle = async (interaction) => {

}

${INTERACTION_NAME}.createInstance = (id) => {
     return []
}

export default ${INTERACTION_NAME}