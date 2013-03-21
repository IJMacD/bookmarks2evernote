genex_bookmarks
===============

Evernote Bookmark Importer

While migrating all my stuff from springpad to evernote,
I created a quick and dirty perl script.
Call the script and give it a .html file with links as argument:
 
perl genex_bookmarks.pl mybookmarks.html 

Works great with bookmarks files, eg. export bookmarks as .html
from firefox or chrome. But basically works just with every other .html file.
It just parses all the a-href tags.
 
The script tags all found links as ‘bookmark’ and writed an .enex file, which
can be imported with the desktop version (win / mac / whatever) of evernote.

You are free to use and modify it. Have Fun!

Original release on my blog: 
    http://www.daheim.li/2012/05/01/evernote-bookmark-importer/
