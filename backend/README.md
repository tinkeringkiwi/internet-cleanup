# Backend

Backend receives reports, collates them for admins to look at, and creates a list update file. 

Responsibilities:
- Create an update file every ~hour
    - Compress it
    - Serve it to users 
        - Users must calculate a nonce to download?
- Receive reports from users
    - Store the reports in database
    - Allow admin to approve a site to list
    - Report types:
        - Cookie Popups
        - Newsletter popups
        - Slop
        - Removal Request
- Allow an administrator to check and approve reports
- Allow administrator to log in
    - Login with pass phrase
    - Issue an API key


Datbase tables:
- Report
    - UUID
    - Date/time
    - Report Type - cookie, newsletter, slop, remove
    - Domain.tld
    - Full URL
    - Comments
- Site
    - domain.tld
    - First Seen
    - Last Changed
- List
    - ID - cookie, newsletter, slop
    - Action - redirect, warn
- listsites
    - domain.tld
    - list.id
    - DateAdded
    - DateRemoved
    - LastChanged
- User
    - ID
    - Passphrase (hash)
    - Added
    - Enabled (bool)

Update file schema:
