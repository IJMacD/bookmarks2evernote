#!/usr/bin/perl
#
# usage: genenex.pl <inputfile> <outputfile>
#
# reads chrome bookmarks file or springpad export file
# and generates an evernote .enex file, but only processes
# the urls (no additional stuff) and adds the the tag 'bookmark' 
#
# https://github.com/gufertum/genex_bookmarks

use strict;
use HTML::Parser;
use HTML::Entities;

my $num_args = $#ARGV + 1;
if ($num_args != 1) {
  print "\nUsage: genenex.pl bookmarksinputfile.html\n";
  exit;
}

print "Genex Version 1.0 by thomas(at)lambda.li\n";
print "-- use as you like -- no warranty ever --\n";
print "-----------------------------------------\n";

# first name and last name
my $in=$ARGV[0];
print "- reading $in\n";
open INFILE, "<$in" or die $!;
my $out=$ARGV[0] . ".enex";
print "- writing $out\n";
open OUTFILE, ">$out" or die $!;

my @links;
my $p = new HTML::Parser;
$p->handler(start => \&start_handler,"tagname,attr,self");
$p->parse_file("$in");

sub start_handler{
  return if(shift ne 'a');
  my ($class) = shift->{href};
  my $self = shift;
  my $text;

  $self->handler(text => sub{$text = shift;},"dtext");
  $self->handler(end => sub{push(@links,[$class,$text]) if(shift eq 'a')},"tagname");

}

print OUTFILE "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
print OUTFILE "<!DOCTYPE en-export SYSTEM \"http://xml.evernote.com/pub/evernote-export.dtd\">\n";
print OUTFILE "<en-export export-date=\"20120429T182117Z\" application=\"Evernote/Windows\" version=\"4.x\">\n\n";

my $title;
my $url;
my $count = 0;

foreach my $link(@links){

  $title = $link->[1];
  $title =~ tr/\x80-\xFF//d;
  $title = encode_entities($title);
  #if ($title == "") {
  #	$title = "URL";
  #}
  $url = encode_entities($link->[0]);
  
  $count++;
  
  print OUTFILE "<note><title>$title</title><content><![CDATA[<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  print OUTFILE "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">\n";
  print OUTFILE "<en-note style=\"word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;\">\n";
  print OUTFILE "$title\n";
  print OUTFILE "<a href=\"$url\">$url</a>\n";
  print OUTFILE "</en-note>]]></content><created>20120429T181936Z</created><tag>bookmark</tag><note-attributes><source-url>$url</source-url></note-attributes></note>\n\n";

}

print OUTFILE "</en-export>\n";

close INFILE;
close OUTFILE;

print "\n";
print "$count links found.\n";

exit;
