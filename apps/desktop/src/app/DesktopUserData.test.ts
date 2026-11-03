import * as NodeServices from "@effect/platform-node/NodeServices";
import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";

import { resolveUserDataPath } from "./DesktopUserData.ts";

it.effect.each(["t3code", "T3 Code (Alpha)"])(
  "keeps the personal profile separate from %s and its encryption key",
  (sourceName) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const directory = yield* fs.makeTempDirectoryScoped({ prefix: "t3-personal-profile-" });
      const source = path.join(directory, sourceName);
      yield* fs.makeDirectory(source, { recursive: true });
      yield* fs.writeFileString(path.join(source, "Local State"), "official-encryption-key");
      const destination = yield* resolveUserDataPath({
        appDataDirectory: directory,
        isDevelopment: false,
        platform: "win32",
      });
      assert.equal(destination, path.join(directory, "t3-personal"));
      assert.isFalse(yield* fs.exists(path.join(destination, "Local State")));
      assert.equal(
        yield* fs.readFileString(path.join(source, "Local State")),
        "official-encryption-key",
      );
    }).pipe(Effect.scoped, Effect.provide(NodeServices.layer)),
);
