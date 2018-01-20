# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import urllib.request as req
from bs4 import BeautifulSoup
import os
import time
import sys
import json


def getResponse(reqURL):
    response = req.urlopen(reqURL)
    data = response.read()
    return data

#scrapes quotes by page numbers..
def getQuotesUptoPageNumber(url):
    #print("Enter specific page number upto which you want the quotes specific page..")
    #page = int(input("Page number please.."))
    page = 30
    combine_list = []
    #i = 1
    list_of_dict = []
    for i in range(page):
        #print("Page found.")
        print("Getting top quotes for the page: "+str(i+1))   
        complete_url = url +"/tag/inspirational?page="+str(i+1)
        data = getResponse(complete_url)
        soup = BeautifulSoup(data, 'html.parser')
        quotes_list = [quote.text.strip().split("\n")[0] for quote in soup.find_all('div', {'class': 'quoteText'})]
        author_list= [quote.text.strip().split("\n")[2] for quote in soup.find_all('div', {'class': 'quoteText'})]
        trim_author_list = []
        for ele in author_list:
          	trim_author_list.append((ele.replace('“','')).lstrip())

        
        text = ""
        for q,a in zip(quotes_list, trim_author_list):
            text = "" + q + " - " + a
            combine_list.append(text)
    print(combine_list)
    #for f_q, f_a in zip(quotes_list, trim_author_list): 
    #	d = {
    #	'quote' : f_q,
    #	'author' : f_a
    #	}
    #	list_of_dict.append(d)
    
    '''
			
        #print(quotes_list[0])
        #print(trim_author_list[0])
        #print(list_of_dict)

        for q,a in zip(quotes_list, author_list1):
        	#combine_list.append(q)
        	#combine_list.append(a)
        #print(combine_list)
        #print(combine_list)
        #i += 1
    #writeToJSON(combine_list)
		'''


def getTopQuotesByAuthor(url):
	pass

def main():
    base_url = "https://www.goodreads.com/quotes"
    getQuotesUptoPageNumber(base_url)

if __name__ == '__main__':
    main()



