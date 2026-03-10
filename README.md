# @open-core/fivem-adapter

External FiveM adapter for `@open-core/framework`.

## Usage

```ts
import { Server } from '@open-core/framework/server'
import { Client } from '@open-core/framework/client'
import { createFiveMServerAdapter, createFiveMClientAdapter } from '@open-core/fivem-adapter'

await Server.init({ mode: 'CORE', adapter: createFiveMServerAdapter() })
await Client.init({ mode: 'CORE', adapter: createFiveMClientAdapter() })
```
