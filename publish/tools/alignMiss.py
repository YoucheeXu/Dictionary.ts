#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import os

def main():

    missFile = os.path.join("..", "log", "miss.txt")

    missFile2 = os.path.join("..", "log", "miss2.txt")

    wordDict = {};

    with open(missFile, 'r') as miss:       
        for line in miss:
            # print("line: " + line);
            txtLine = line.strip()
            if len(txtLine) != 0:
                print("txtLine: " + txtLine);
                # print("Length of txtLine: %d\n" %len(txtLine));
                lstLine = line.split(':')
                print(lstLine);
                reason = lstLine[1].strip()
                lstLine2 = lstLine[0].split(' of ')
                typ = lstLine2[0].strip()
                word = lstLine2[1].strip()
                print('%s: fail to get %s, due to %s\n' %(word, typ, reason))
                # content = {}
                # content[typ] = reason
                # wordDict[word][typ] = reason
                wordDict.setdefault(word, {})[typ] = reason
                

    os.system("pause")

    with open(missFile2, "w") as miss2:
        wordDictKeyList = sorted(wordDict)
        for key in wordDictKeyList:
            value = wordDict[key]
            for typ, reason in value.items():
                print(key, ' -> ', typ, reason)
                miss2.write(typ + ' of ' + key + ': ' + reason + '\n')
            miss2.write('\n')
if __name__ == '__main__':
    main()
