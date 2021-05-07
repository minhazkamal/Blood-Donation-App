# Handy-Copy
A handy way to copy anything to clipboard. Screenshots below!!

# Quick links
1. [Screenshots](#screenshots)
2. [Usage](#usage)
3. [API options](#api)

# Screenshots
![alt text](https://raw.githubusercontent.com/yTakkar/Handy-Copy/master/screenshots/Snap%202017-07-07%20at%2003.10.41.png)
![alt text](https://raw.githubusercontent.com/yTakkar/Handy-Copy/master/screenshots/Snap%202017-07-07%20at%2003.10.29.png)

These screenshots are from [React-Instagram-clone-2.0](https://github.com/yTakkar/React-Instagram-clone-2.0)!!

# Usage with npm or Yarn

1. First install the package with `npm` or `Yarn`.
```bash
#npm 
npm install handy-copy

#or with yarn
yarn add handy-copy
```

2. And here comes the fun part.
```javascript
import Copy from 'handy-copy'
Copy({
    value: "I will be copied!",   // What you want to copy
    done: () => {                 // Callback function    
        console.log('Link Copied!!')
    }
})
```

# API
```javascript
Copy(options:Object)
options = {
    value,
    done
}
```

**Thanks for reading!!**
