# Dictionary.ts

## To-Do

### Common

* word dict
	* origin word (margins -> margin)
	* read/mark function
* support download by proxy
* support mdx
* icon

### Dictionary Mode

* add the word we query to new words list
* up and down key to choose list word
* add + to add tab and associate with new dictionary
* edit word on-line of SDictBase
* display "webDefinitions" of GDictBase

### Recite Mode

* support multiuser
* support multilevel
* add state indicator
* estimate day to finish
* show report when finished reciting

## Known Bugs

### Common

* sometimes it will cause zip error
* delete word command can't delete word in word's dictionary

### Dictionary Mode

* after download, it will not update
* SDictBase doesn't display well
* miss largest by large
* characterize doesn't pronounce
* some like "\x27" doesn't display well in html
* record downloading in log
* sometimes it will pronounce

### Recite Mode

* after download mp3, it will not update
* sometimes it will pronounce

## change in v0.0.0.1

### New Function

#### Common

#### Dictionary Mode

* only record when fail to download

#### Recite Mode

* compute recite time

### Bug-Fixed

#### Common

* fix repetition in download queue
  * if the file already in local drive, it will not download it again
  * if the file already in download queue, it will not be added into it

#### Dictionary Mode

* Get in word is not OK, eg. honing

#### Recite Mode