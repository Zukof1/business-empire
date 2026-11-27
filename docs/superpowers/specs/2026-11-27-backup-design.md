# Backup, protected storage and Home Screen icon: design

Approved in chat on 2026-11-27, from a mockup, with the coin icon.

## Intent
Keep progress safe on iPhone, where Safari can delete a site's data after about a week away, and let the player move a
game between Safari, the Home Screen app and other phones. The Home Screen app has its own separate save.

## Backup
- A Backup card on Stats, between Taxes and Prestige: **Copy backup code** and **Restore from a code**.
- Copy puts the whole game on the clipboard. If the phone refuses, the code is shown in a box to copy by hand.
- Restore: paste, **Next**, then a red **Replace** confirmation showing the saved balance.
- A broken or incomplete code changes nothing and says so.
- Restoring pays nothing for the time since the backup was made. A welcome back amount already waiting in the backup
  is kept.
- Accepted: an older code can be used to undo bad luck.

## Protected storage
The game asks the browser to keep its data when it starts. No screen.

## Home Screen
Name **Empire**. Icon: yellow coin on the game's blue. Opens full screen.

## Approaches
A copied code (chosen) needs no server or account. A downloaded file is harder to find again on iPhone. Cloud saving
needs accounts and a server.

## Builder's calls
- The code is `BE1:` followed by the save in base64.
- Codes containing `<`, `>`, `"` or a backtick are refused, because saved text is drawn on screen and a code can come
  from someone else.
