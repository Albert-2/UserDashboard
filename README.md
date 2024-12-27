<body>
  <h1>Description</h1>
  <p>This project is a user authentication app using Next.js for the frontend, Firebase for authentication, Firestore(NoSQL) as a database, and NestJS for the backend API. It manages user state with Redux and allows seamless login, redirecting authenticated users to their personalized dashboard. The UI is styled with TailwindCSS for a responsive, clean design.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>NestJS Framework</strong>: Progressive Node.js framework for building efficient server-side applications.</li>
    <li><strong>Firebase Integration</strong>:
      <ul>
        <li>Authentication using email and password.</li>
        <li>Firestore database for data storage.</li>
        <li>Firebase Admin SDK for server-side operations.</li>
      </ul>
    </li>
  </ul>

  <h2>Project Setup</h2>
  <ol>
    <li>Clone the repository:
      <pre><code>git clone https://github.com/Albert-2/UserDashboard.git</code></pre>
    </li>
    <li>Install dependencies:
      <pre><code>npm install</code></pre>
    </li>
  </ol>

  <h2>Firebase Configuration</h2>
  <ol>
    <li><strong>Create a Firebase Project</strong>:
      <ul>
        <li>Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a>.</li>
        <li>Create a new project.</li>
      </ul>
    </li>
    <li><strong>Enable Authentication</strong>:
      <ul>
        <li>Navigate to <strong>Build > Authentication</strong>.</li>
        <li>Enable the <strong>Email and Password</strong> sign-in method.</li>
      </ul>
    </li>
    <li><strong>Download Firebase Config File</strong>:
      <ul>
        <li>Go to <strong>Project Settings > General > Your Apps</strong>.</li>
        <li>Register your app and download the Firebase configuration file (e.g., <code>firebaseConfig</code> with API key, project ID, etc.).</li>
        <li>Save the configuration details in an <code>.env</code> file or directly in your app configuration.</li>
      </ul>
    </li>
    <li><strong>Enable Firestore Database</strong>:
      <ul>
        <li>Navigate to <strong>Build > Firestore Database</strong>.</li>
        <li>Set up Firestore in "Start in production mode" or "Start in test mode" as needed.</li>
      </ul>
    </li>
    <li><strong>Generate Firebase Admin SDK Private Key</strong>:
      <ul>
        <li>Navigate to <strong>Project Settings > Service Accounts</strong>.</li>
        <li>Click <strong>Generate New Private Key</strong> and download the JSON file.</li>
        <li>Place the file securely in your project and reference it in your <code>.env</code> file with a path to the key.</li>
      </ul>
    </li>
  </ol>
  <p>Example <code>.env</code> file:</p>
  <pre><code>
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_PRIVATE_KEY_PATH=path/to/your/private-key.json
  </code></pre>

  <h2>Compile and Run the Project</h2>
  <pre><code>
# development
npm run start

### watch mode
npm run start:dev

### production mode
npm run start:prod
  </code></pre>

  <h2>Deployment</h2>
  <p>When you're ready to deploy your NestJS application to production, ensure all environment variables are set up properly. Refer to the <a href="https://docs.nestjs.com/deployment" target="_blank">NestJS Deployment Documentation</a> for detailed steps.</p>

  <h2>License</h2>
  <p>Nest is <a href="https://github.com/nestjs/nest/blob/master/LICENSE" target="_blank">MIT licensed</a>.</p>
</body>
