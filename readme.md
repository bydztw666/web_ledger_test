# web_ledger

A real-time group expense sharing app with automated settlement and WebSocket-based live updates.

## Next
- The interface is hard to use now, so we will improve or remake the interface in the next version.
- We have a plan to bulid this project inside WeChat as a mini-program.

## Changelog

### v0.1.0 (2025-05-20)
- First working version of the backend
- Create/read/delete ledgers, members, transactions
- Auto-settlement with multiple currencies
- WebSocket-powered real-time updates
- Postman-tested RESTful API

### v0.2.0 (2025-05-22)

This is the **first usable version**, with full frontend functionality implemented:

- Create and join ledgers
- Add, view, and delete transactions
- Select payer, participants, and currency
- Dynamic member management (add/delete)
- Manual and automatic settlement calculation
- Realtime sync (Socket.IO supported)
- Frontend refreshable without page reload
