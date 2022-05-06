import("./config-dev.json") //lmao

declare module "interactions/**.ts" {
     export default import("./Structures/InteractionApp").InteractionApp
}

declare type TConfig = typeof import("./config.json")