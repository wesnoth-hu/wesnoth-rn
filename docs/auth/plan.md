# Authentication Plan

1. [x] SignIn/SignUp with email & password
2. [x] Verify login credentials fully with DB
3. [x] Allow choosing between username and email at Login
4. [x] Create sealed cookie in browser, save session cookie in DB
5. [x] Create single prisma instance for server-side functions
6. [x] Use authN context provider for Menu component
7. [ ] Set up rate limiting globally, for authN and warrants
8. [ ] Use authN, session context and warrants for conditional data fetching and rendering
   - [x] authN, context session set up for Account component
   * [ ] set up warrants for Account component
9. [ ] Set up warrants globally and used per-component level
10. [ ] Check session in DB with session cookie and context session for server & client requests periodically(eg. 5 min)
11. [ ] Re-structure files in directory for transparency
12. [ ] Add documentation for code

### AuthN Tech stack

- Session Cookies
- Bcrypt
- Hapi Iron
- React Context
- Warrant
