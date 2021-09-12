#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import os
import re
import argparse

def main():

	parser = argparse.ArgumentParser(description = "mark words' level into sqlDict by reading from txtDict")

	parser.add_argument("txtDict", help = "txtDict, which words' level from")
	args = parser.parse_args()

	dictPath = os.path.abspath(os.path.dirname(__file__))
	print("dictPath: " + dictPath)

	txtDict = os.path.join(dictPath, args.txtDict)

	file, _ = os.path.splitext(txtDict)
	# log = os.path.join(dictPath, file + "_log.log")

	wdLst = [];
	with open(txtDict, 'r', encoding='utf8') as fidin:
		# with open(log, "w", encoding='utf8') as loger:
		tLines = fidin.readlines()
		for tLine in tLines:
			strAry = re.split(r"[\t]+", tLine)
			# print(strAry)
			word = strAry[0].strip().strip("*")
			wdLst.append(word)

	# words = "able abandon echo"
	words = " ".join(wdLst)

	maxLen = 200
	while len(words) > maxLen:
		index = words.find(" ", maxLen - 1)
		if index > 0:
			wordsSub = words[: index]
			# print("word1: " + wordsSub)
			words = words[index + 1: ]
			# print("word2: " + words)

			paras = '"%s" "%s"'%('--type c', '--q ' + wordsSub)
			# print("paras: " + paras)

			# os.system(r'..\bin\Dictionary.exe "--type c" "--q able"')
			os.system(r"..\bin\Dictionary.exe " + paras)
		else: break

	paras = '"%s" "%s"'%('--type c', '--q ' + words)
	# print("parasEnd: " + paras)

	os.system(r"..\bin\Dictionary.exe " + paras)

if __name__ == '__main__':
	main()
