## npm start

```
http://localhost:3000
```

## npm run test

```
http://localhost:3000
```

## CSS Conventions

```
1- Class Names must be short 
2- Use BEM Conventions
3- Class Name to be small case. Use Camel Case for multiple words.
4- Elements should be preceded with a '--'
5- Modifiers should be preceded with a '-'

```

## Project structure

You'll find the following directories and files in source code.

```
assignment/

├── static/                     # Contains all static resources.
├── src/                        # project root
│   ├── main/                   # Main Source code folder
|      ├── api/                 # API
|      ├── components/          # Components folder
|      ├── redux/               # Store folder
|      ├── models/              # Interface folder
|      ├── utils/               # Common functions folder          
|      ├── test/                # Test cases folder
│   ├── pages/                  # Pages folder
|   ├── static/                 # Static css
|   ├── index.ts                # root file
|   ├── setupTest.ts            # Test case file
│
├── build                       # This folder contains typescript compiled code. 
│                                 This folder is ignored and will not be committed.
│
├── .gitignore                  # defaults for gitignore
├── package.json                # build scripts and dependencies
├── package-lock.json           # Detailed dependencies for all entries in package.json
├── README.md                   # this file
├── tsconfig.json               # typescript config
├── jest.config.json             # testcase config
├── tailwind.config.json        # tailwind config


```





