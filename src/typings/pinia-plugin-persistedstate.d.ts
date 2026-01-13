// src/typings/pinia-plugin-persistedstate.d.ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?:
      | {
          key?: string
          storage?: Storage
          paths?: string[]
          serializer?: {
            serialize: (value: any) => string
            deserialize: (value: string) => any
          }
          beforeRestore?: (context: any) => void
          afterRestore?: (context: any) => void
          debug?: boolean
        }
      | boolean
  }
}
