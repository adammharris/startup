# ShowBrain

[My Notes](notes.md)



## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [ ] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Do you ever have so much to say that you wish you could just… take your brain out and show someone? ShowBrain can help! It's like Facebook but for longform text content. (And without feeds and privacy issues.) It's a website that takes a collection of personal files (for example, class notes, or a digital journal) and helps you safely publish them for friends to see and comment on. By default, all files are private, and access levels are easy to configure: for example, allow your coworkers to access one set of files, allow your family to access all of those plus some more, let one specific friend have access to one specific file, and so forth.

### Design

![Design image](placeholder.png)

Here is a rough sequence diagram that shows how ShowBrain works. It is essentially a social media/blogging application, but with a focus on small groups and personal utility rather than making lots of things known to the public.

```mermaid
sequenceDiagram
    actor Friend
    actor Admin
    participant ShowBrain
    participant NewSite
    Admin->>ShowBrain: Admin logs into ShowBrain and creates a new site
    ShowBrain->>NewSite: Creates NewSite with admin "Admin"
    NewSite-->>Admin: Admin access to NewSite
    Admin->>NewSite: Upload files and assign access levels
    NewSite-->>Admin: Unique links to files and "blog format"
    Friend->>ShowBrain: Registers on ShowBrain
    Friend->>NewSite: Accesses NewSite through ShowBrain account
    NewSite-->>Friend: Automatically assigned "Public" access level
    NewSite-->>Admin: Shows that user has joined NewSite
    NewSite-->>Friend: Public files and comments
    Admin->>NewSite: Assigns friend access level of "Friend"
    NewSite-->>Friend: Receives access level "Friend"
    Friend->>NewSite: Accesses NewSite with ShowBrain account
    NewSite-->>Friend: Files and comments with "Public" and "Friend" access levels
    Friend->>NewSite: Comments on files
    NewSite-->>Admin: Comments made visible via WebSocket
```

### Key features

- Secure register/login over HTTPS
- Upload personal documents/digital journal to publish them online
- Set and fine-tune access levels for each file or collection of files
- Allow friends to register, get assigned an access level, and stay connected by interacting with your documents

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Provides the basic structure of the page, including the Home, Login, Public, Contact, and Help pages.
- **CSS** - Helps website adjust to fit any device and look nice
- **React** - Facilitates authentication and adjusts files that are shown based on the account's access level
- **Service** - Upload documents, assign access levels, publish to unique links, register/login to see files of different access levels
- **DB/Login** - If a user does not login, they can see all files given the "public" access level. If they do, they can be assigned further access levels by the author so they can see more files.
- **WebSocket** - Commenting, liking, etc.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [showbrain.net](https://showbrain.net).

Note: the request is still processing and AWS says it could take up to seven days

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [ ] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [ ] **Images** - I did not complete this part of the deliverable.
- [ ] **Login placeholder** - I did not complete this part of the deliverable.
- [ ] **DB data placeholder** - I did not complete this part of the deliverable.
- [ ] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
