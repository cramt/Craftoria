# Craftoria - 1.21

# Setup
Follow the instructions below to get your workspace setup:

## CurseForge App (Windows / Mac)
1. Download the [CurseForge App](https://curseforge.overwolf.com/) and [Git](https://git-scm.com/downloads) if you haven't already.

2. Fork and clone the repository to the Instances folder of the CurseForge App, the default path is `C:\Users\{UserName}\Documents\Curseforge\Minecraft\Instances`.

* Note: If you've previously used the Twitch App the path will most likely be `C:\Users\{UserName}\Documents\Twitch\Minecraft\Instances`.
3. Double click the script InstanceSyncSetup.bat to setup InstanceSync. It is found in the automation folder.

4. Open the CurseForge App and you should see the modpack. If you already had CurseForge App open, restart it.

You're done!

# Discord server

Official discord server (Team AOF): https://discord.gg/6rkdm48

# Fork notes

This fork tracks Craftoria **1.31.0** (upstream `TeamAOF/Craftoria`, commit `3483b7e`) and adds
Create Aeronautics. Every deviation from the published 1.31.0 modlist is listed below with the
reason it exists and the condition under which it can be dropped.

## Added

| Mod | Why |
| --- | --- |
| Create Aeronautics 1.3.1 | The point of the fork. |
| Sable 2.0.5 | Required by Create Aeronautics. Bundles Veil. |

## Forced by the above

| Change | Why | Removable when |
| --- | --- | --- |
| Embeddium -> Sodium + Sodium Extra | Sable bundles Veil, which requires Sodium >= 0.8.12-alpha.2 and refuses to load alongside Embeddium. | Never, while Sable is present. |
| Iris 1.8.12 -> 1.8.14-beta.1 | 1.8.12 targets the Embeddium pipeline; 1.8.14 is the Sodium 0.8.x build. | Never, while Sodium is present. |
| Supplementaries 3.6.5 -> 3.6.8 | 3.6.5's Sodium compat mixin injects at `ColorProvider.getColors(...)` with 6 args; Sodium >= 0.8.12-alpha.2 added a 7th (`boolean`), so the injection matches nothing and hard-crashes on fluid rendering. 3.6.8 is the first release targeting the new signature. | Never, while Sodium is present. Upstream pairs Sodium with 3.9.1. |
| Monocle **removed** | Monocle is an Embeddium<->Iris bridge ("Allows Iris to use the Embeddium pipeline"). Its nested `monocle-mod-file.jar` declares `type="required"` on both `embeddium [1.0.7,)` and an exact Iris version. It cannot load without Embeddium. | Never, while Sodium is present. **Do not "restore" it** — its absence is deliberate. |

## Forced by CurseForge distribution flags

| Change | Why |
| --- | --- |
| Antique Trading Ship 1.4.0 -> 1.3.0 | 1.4.0 is flagged "excluded from the CurseForge API" and cannot be fetched by third-party clients. Modrinth only carries 1.3.0. |

## Mod sources

Pins prefer Modrinth wherever Modrinth hosts the **byte-identical jar** (matched by hash, so no
version drift). Mods with no Modrinth copy stay on CurseForge. Some CurseForge files are flagged
non-distributable and will make `packwiz-installer` stop and ask for a manual download; moving
those to Modrinth (at the same version) is the fix where one exists.
