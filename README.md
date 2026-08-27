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

This fork tracks Craftoria **1.32.1** (upstream `TeamAOF/Craftoria`, commit `61eb11d`) and adds
Create Aeronautics. Every deviation from the published 1.32.1 modlist is listed below with the
reason it exists and the condition under which it can be dropped.

At 1.31.0 this fork also carried an Embeddium -> Sodium swap (with matching Iris, Supplementaries,
and Monocle changes) because Sable bundles Veil, which requires Sodium >= 0.8.12-alpha.2. Upstream
made the same swap itself in 1.32.0, so those deviations are gone. The Veil floor still applies:
if upstream ever pins Sodium below 0.8.12-alpha.2, the old fork pins come back (see the fork-notes
table as of commit `88393db`).

## Added

| Mod | Why |
| --- | --- |
| Create Aeronautics 1.3.1 | The point of the fork. |
| Sable 2.0.5 | Required by Create Aeronautics. Bundles Veil. |

## Forced by CurseForge distribution flags

| Change | Why |
| --- | --- |
| Antique Trading Ship 1.4.0 -> 1.3.0 | 1.4.0 is flagged "excluded from the CurseForge API" and cannot be fetched by third-party clients. Modrinth only carries 1.3.0. |
| 7 resourcepacks **removed** (Better Sophisticated Backpack Upgrades, Craftoria Chinese Translation, Iron's Spells Armors Overhaul, Pixel's Simple HUD, Pretty x Smart Pipez + Mekanism Edition, SUREN SS) | Flagged "excluded from the CurseForge API" with no Modrinth copy; a from-scratch install aborts on them. Details in commit `88393db`. |
| EMI QoL Tweaks **removed** (added upstream in 1.32.x) | Same flag, CurseForge-only, no Modrinth/GitHub copy. It is client-side EMI/FTB-Quests UI polish, so dropping it costs a convenience, not content. |

## Mod sources

Pins prefer Modrinth wherever Modrinth hosts the **byte-identical jar** (matched by hash, so no
version drift). Mods with no Modrinth copy stay on CurseForge. Some CurseForge files are flagged
non-distributable and will make `packwiz-installer` stop and ask for a manual download; moving
those to Modrinth (at the same version) is the fix where one exists.

The re-sourcing is scripted: after merging an upstream release, run
`bun automation/scripts/src/prefer-modrinth.js` followed by `packwiz refresh`.
