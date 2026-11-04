# T3 Personal on Windows

Personal builds use appId `com.spiralhead.t3personal`, Electron profile `%APPDATA%/t3-personal`, and server data `~/.t3-personal/userdata`. Do not set T3CODE_HOME to the official installation's home. No profile or credential migration runs automatically. Keep official T3 installed; configure providers in the new profile and authenticate again. Do not copy live databases or encrypted secrets between profiles.

The separate `codex-safe`, `codex-proxy-safe` and `claude-proxy-safe` commands and their VPN/WFP protections remain external integrations. Select their existing wrappers in the new profile. Their machine configuration, credentials, binaries and firewall rules are not distributed by this repository. No LSM.AI changes are included.

Ported UI features: hide limits only for `codex-proxy` and `codex-proxy-safe`; Ctrl+Alt+P toggles the open thread's project group and all projects with terminal, dialog, composition and repeat guards; show received reasoning with wrapping and scrolling. This does not retrieve undisclosed reasoning.

Run the manual Personal Windows installer workflow in GitHub Actions, then download its Windows x64 artifact. Builds are unsigned. Check SHA256.txt before installing. Automatic update feeds are omitted: update manually from a reviewed personal build. The official updater does not manage the separate app identity.

For rollback, uninstall T3 Personal through Windows Settings and open official T3. Keep the personal data directory until you have verified the rollback. Do not replace the official installation with personal files.

To incorporate upstream: fetch upstream, merge upstream/main into a personal branch, review conflicts in identity/storage/update and UI files, run focused checks and build a new personal version. Never replace origin with upstream. Preserve MIT LICENSE and third-party notices in redistributed installers.

## T3 Connect

Starting with 0.1.6-personal.2, the Windows workflow embeds the production public configuration from upstream `.env.example`, as documented in `connect-setup.md`. No account tokens, server secret keys or existing registrations are copied. Sign in again in Settings > Sharing & access and enable T3 Connect; other clients sign into the same account. Tailscale is not required for the Connect relay route.

The upstream Clerk desktop sign-in uses the shared `t3code://app` callback and registers its protocol handler when the desktop bridge starts. With both official T3 and this fork installed, the last application to register the scheme can receive browser sign-in callbacks. Complete sign-in in the intended app; simultaneous sign-in in both apps is not verified. Profiles and encryption keys remain separate. A real account sign-in and a remote round trip must still be checked by the user; the build only verifies public configuration is included.
