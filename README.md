# TabTrek 
TabTrek is a productivity-focused Chrome extension that tracks your browsing habits, summarizes visited sites and gamifie your daily productivity.
It is a lightweight and smart chrome extension that automatically monitors websites you visit, categorizes them and generates daily summaries. It helps users understand their digital habits while adding a fun gamified layer to improve productivity.
Whether you are a student, developer or working professional, TabTrek gives you insights into your browsing pattern - distraction time vs productive time

### Features
**1. Automatic Time Tracking** : Tracks how long you spend on each website
**2. Smart Summary Generation** : Creates a clean summary of all websites visited throughout the day.
**3. Category Classification** : Groups websites into entertainment, social, productive, news, shopping etc.
**4. Gamification** : Earn points for productive browsing and lose points for distraction.
**5. Simple and Clean UI (POPUP)** : View starts instantly from the extension popup

### Tech Stack
**Frontend / Extension**
1. HTML
2. CSS
3. JavaScipt
4. Chrome Extension APIs
5. Manifest v3

**Backend Logic**
1. JS runtime inside service worker
2. Local storage for analytics

### Installation
1. Download the project as ZIP / clone repo.
2. Go to **chrome://extensions/**.
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the **TabTrek** folder.
6. The extension will now appear in your toolbar.

### How it Works
#### **Tracking Logic**
1. The service worker listens for 'tabs.onUpdated' and 'tabs.onActivated'.
2. Every time you open or switch to a new tab, the extension records the **URL**.
3. These URLs are stored in 'chrome.storage.local' for later use.

#### **Summary Generation**
1. When the user opens the popup, the extension fetches all stored URLs.
2. It removes duplicates, group similar websites together and generates a simple summary of :
  - Most visited sites
  - Categories
  - Total number of sites visited in a session

#### **Gamification Logic**
1. Each webiste category has predefined points
2. The popup shows the final score based on all URLs collected that day.

### Future Improvements
1. Dashboard page with graphs
2. Cloud sync for cross-device tracking
3. Weekly and monthly analytics
4. AI-based productivity recommendations

This README provides an overview of TabTrek, including the description of tech stack required for it. It aims to be informative for viewers and collaborators referring to this repository.
















