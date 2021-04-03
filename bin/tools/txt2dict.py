#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import os
import re
import sqlite3
import argparse

class SQLiteDict():
	def Open(self, file):

		if os.path.isfile(file) == False:
			raise Exception("%s doesn't exit!" % (file))
			return False

		self.__conn = sqlite3.connect(file)
		self.__cur = self.__conn.cursor()
		print(file + "is OK to open!")
		return True

	def UpdateItem(self, word, item, v):
		command = 'update Words set ' + item + ' = "' + v + '" where Word = "' + word + '"'
		# print(command)
		self.__cur.execute(command)
		# self.__conn.commit()

	def GetItem(self, word, item):
		try:
			command = 'select ' + item + ' from Words where Word = "' + word + '"'
			self.__cur.execute(command)
			content = self.__cur.fetchone()
		except:
			print("error to exc:" + command)

		if content:
			return True, content[0]
		else:
			return False, None

	def InsertItems(self, word, items, values):
		# 'INSERT INTO Words (Word, Symbol, Meaing) VALUES("", "apple", "broccoli")'
		command = 'insert into Words ' + items + ' values ' + values
		print(command)
		self.__cur.execute(command)
		# self.__conn.commit()

	def Commit(self):
		self.__conn.commit()


def main():

	parser = argparse.ArgumentParser(description = "mark words' level into sqlDict by reading from txtDict")

	parser.add_argument("txtDict", help = "txtDict, which words' level from")
	parser.add_argument("sqlDict", help = "sqlDict, which to be inserted")
	parser.add_argument("-lvl", "--level", help = "level")
	args = parser.parse_args()

	level = args.level

	dictPath = os.path.abspath(os.path.dirname(__file__))
	print("dictPath: " + dictPath)

	sqlDict = SQLiteDict()
	sqlDict.Open(os.path.join(dictPath, args.sqlDict))

	txtDict = os.path.join(dictPath, args.txtDict)

	file, _ = os.path.splitext(txtDict)
	log = os.path.join(dictPath, file + "_log.log")

	with open(txtDict, 'r', encoding='utf8') as fidin:
		with open(log, "w", encoding='utf8') as loger:
			tLines = fidin.readlines()
			for tLine in tLines:
				strAry = re.split(r"[\t]+", tLine)
				# print(strAry)
				word = strAry[0].strip().strip("*")
				symbol = strAry[1].strip()[1: -1]
				meaning = strAry[2].strip()
				ret, oldLvl = sqlDict.GetItem(word, "Level")
				if ret == True:
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
					ret, existSymbol = sqlDict.GetItem(word, "Symbol")
					if ret == True:
						if existSymbol == None:
							print(word + " has no symbol")
							print("symbol in txtDict: " + symbol)
							sqlDict.UpdateItem(word, "Symbol", symbol)
						else:
							print(word + "'s symbol: " + existSymbol)
				else:
					print(word, symbol, meaning)
					loger.write(word + "\n" + symbol + "\n" + meaning + "\n\n")
					sqlDict.InsertItems(word, '(Word, Symbol, Meaning, Level)', '("' + word + '", "' + symbol + '", "' + meaning + '", "' + level + '")')
					# sqlDict.Commit()

		sqlDict.Commit()


if __name__ == '__main__':
	main()
