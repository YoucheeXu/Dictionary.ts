# Change Log

All notable changes to the "Dictionary.ts" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [To-Do]

### Fixed

- when the word of SDictBase is missing, it doesn't show correctly in Dictionary

### Improved

- merged QueryWord2 and QueryWord in Dictionary

### Added

- Go next button and go previous button work in Dictionary
- Double click to query word in Dictionary

## [Unreleased]

### Fixed

- modified the fucntion of AddTabs to make the id of tab equal to the id of dict
- the name of log function of ElectronApp doesn't equal the dict-gui.js to call
- trigger error if there is no zip file
- close "selection a application" dialog could not quit app
- wrong to record error message
- query again the same but failure word

### Improved

- display dict through html file in Dictionary
- files structure
- don't query again if the word is as same as the previous word in Dictionary

### Added

- auto focus input of Dictionary
- read additional ccs or js file from Google_style.zip for Google.zip
- support read resource from corresponding mdd file