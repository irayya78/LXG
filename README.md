File: Information about Mobile Application

Date of Creation: 01-05-2024 by Himanshu

This file contains information about our mobile application and important guidelines for setup and release:

Development Environment:
Node Version: 20.x (latest)
Capacitor for iOS/Android: 5.0.x or above
React: 18 or above
Utilizing React-Vite for build commands; ensure project type is set to React-Vite in package.json

TypeScript: Version 5.1 or above
Java JDK: Version 22 (latest)
Gradle: Version 8.0.2

build.Script
"scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test.e2e": "cypress run",
    "test.unit": "vitest",
    "lint": "eslint"
}


*Important Notes for App Releases:*

1.Change the version code in build.gradle.
2.Update the version name in the UI.

____AppFlow Credentials:___________________________________________________________________________
Username: akrTripathi
Password: Master@12317
______________________________________________

__  Android Signed Key Details:______________________________
Key Password: M@ster12
Key Alias: lxg
Alias Password: M@ster12
_______________________________
For development, you can use AppFlow or Android Studio for Android and Xcode for iOS.

