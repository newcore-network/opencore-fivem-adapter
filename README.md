# @open-core/fivem-adapter

External FiveM adapter for `@open-core/framework`.

## Install

```bash
pnpm add @open-core/fivem-adapter reflect-metadata tsyringe zod
```

## CLI Usage

Use the OpenCore CLI and select the `FiveM` adapter during `opencore init`.

The generated `opencore.config.ts` will look like this:

```ts
import { defineConfig } from '@open-core/cli'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'

export default defineConfig({
  name: 'my-server',
  destination: 'C:/FXServer/server-data/resources',
  adapter: {
    server: FiveMServerAdapter(),
    client: FiveMClientAdapter(),
  },
})
```

## Manual Usage

```ts
import { Server } from '@open-core/framework/server'
import { Client } from '@open-core/framework/client'
import { FiveMServerAdapter } from '@open-core/fivem-adapter/server'
import { FiveMClientAdapter } from '@open-core/fivem-adapter/client'

await Server.init({ mode: 'CORE', adapter: FiveMServerAdapter() })
await Client.init({ mode: 'CORE', adapter: FiveMClientAdapter() })
```

## Notes

- FiveM uses the standard OpenCore resource layout.
- The CLI keeps server and client files inside the same resource folder.
- `fxmanifest.lua` is expected for FiveM resources.
