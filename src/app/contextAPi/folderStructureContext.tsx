import { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define types
export type StructureNode = {
  name: string;
  type: 'file' | 'folder';
  children?: StructureNode[];
  content?: string;
};

type FolderStructureContextType = {
  FolderStructure: StructureNode;
  setFolderStructure: React.Dispatch<React.SetStateAction<StructureNode>>;
};

// 2. Default folder structure
const defaultStructure: StructureNode = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "node_modules",
      type: "folder",
      children: []
    },
    {
      name: "public",
      type: "folder",
      children: [
        {
          name: "favicon.ico",
          type: "file",
          content: ""
        },
        {
          name: "index.html",
          type: "file",
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using Create React App" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
        },
        {
          name: "manifest.json",
          type: "file",
          content: `{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}`
        },
        {
          name: "robots.txt",
          type: "file",
          content: `User-agent: *
Disallow:`
        }
      ]
    },
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "App.css",
          type: "file",
          content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
        },
        {
          name: "App.jsx",
          type: "file",
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hello Create React App</h1>
    </div>
  );
}

export default App;`
        },
        {
          name: "App.test.js",
          type: "file",
          content: `import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/hello create react app/i);
  expect(linkElement).toBeInTheDocument();
});`
        },
        {
          name: "index.css",
          type: "file",
          content: `/* Global styles */`
        },
        {
          name: "index.js",
          type: "file",
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();`
        },
        {
          name: "reportWebVitals.js",
          type: "file",
          content: `const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;`
        },
        {
          name: "setupTests.js",
          type: "file",
          content: `// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';`
        }
      ]
    },
    {
      name: ".gitignore",
      type: "file",
      content: `node_modules
build
.env
coverage
*.log
`
    },
    {
      name: "package.json",
      type: "file",
      content: `{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
   "start": "CHOKIDAR_USEPOLLING=true react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
    },
    {
      name: "README.md",
      type: "file",
      content: `# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
`
    }
  ]
};



// 3. Create context
const FolderStructureContext = createContext<FolderStructureContextType | undefined>(undefined);

// 4. Custom hook to use the context
export const useFolderStructure = () => {
  const context = useContext(FolderStructureContext);
  if (!context) throw new Error("useFolderStructure must be used within a FolderStructureProvider");
  return context;
};

// 5. Provider component
type FolderStructureProviderProps = {
  children: ReactNode;
};

export const FolderStructureProvider = ({ children }: FolderStructureProviderProps) => {
  const [FolderStructure, setFolderStructure] = useState<StructureNode>(defaultStructure);
  console.log(FolderStructure,"Folder srruc")
  return (
    <FolderStructureContext.Provider value={{ FolderStructure, setFolderStructure }}>
      {children}
    </FolderStructureContext.Provider>
  );
};
