#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import os
import sqlite3
import argparse

class SQLite():
	def Open(self, file):

		if os.path.isfile(file) == False:
			raise Exception("%s doesn't exit!" % (file))
			return False

		self.__conn = sqlite3.connect(file)
		self.__cur = self.__conn.cursor()
		print(file + "is OK to open!")
		return True

	def UpdateItem(self, word, item, v):
		command = "update Words set " + item + " = '" + v + "' where Word = '" + word + "'"
		print(command)
		self.__cur.execute(command)
		self.__conn.commit()

	def GetItem(self, word, item):
		try:
			command = "select " + item + " from Words where Word = '" + word + "'"
			self.__cur.execute(command)
			content = self.__cur.fetchone()
		except:
			print("error to exc:" + command)

		if content:
			return True, content[0]
		else:
			return False, None


def main():

	parser = argparse.ArgumentParser(description = "mark words' level into sqlDict by reading from txtDict")

	parser.add_argument("txtDict", help = "txtDict, which words' level from")
	parser.add_argument("sqlDict", help = "sqlDict, which to be inserted")
	parser.add_argument("-lvl", "--level", help = "level")
	args = parser.parse_args()

	level = args.level

	dictPath = os.path.abspath(os.path.join(
		os.path.abspath(os.path.dirname(__file__)), "..\dict"))
	print("dictPath: " + dictPath)

	sqlDict = SQLite()
	sqlDict.Open(os.path.join(dictPath, args.sqlDict))

	txtDict = os.path.join(dictPath, args.txtDict)

	file, ext = os.path.splitext(txtDict)
	log = os.path.join(dictPath, file + "_log.log")

	with open(txtDict, 'r', encoding='utf8') as fidin:
		with open(log, "w") as loger:
			tLines = fidin.readlines()
			for tLine in tLines:
				strAry = tLine.split("\t")
				word = strAry[0].strip().strip("*")
				ret, oldLvl = sqlDict.GetItem(word, "Level")
				if ret:
					bModified = False
					if oldLvl == None:
						print(word + " has no level!")
						newLvl = level
						bModified = True
					else:
						print(word + "'s old level: " + oldLvl)
						# print(type(oldLvl))
						# print(type(level))
						if level not in oldLvl:
							newLvl = oldLvl + ";" + level
							bModified = True
					if bModified == True:
						print(word + "'s new level: " + newLvl)
						sqlDict.UpdateItem(word, "Level", newLvl)
				else:
					loger.write(word + "\n")
					print("miss word: " + word)


if __name__ == '__main__':
	main()
