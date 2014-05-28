$(function(){
	var uploadBtn = $('#btn-upload'),
		importFile = $('#import-file'),
		dropTarget = $('.drop-target'),
		enexTemplate = $('#tmpl-enex').html(),
		enexNoteTemplate = $('#tmpl-enex-note').html(),
		linkList;
	
	uploadBtn.on("click", function(e){
		importFile.click();
	});
	
	importFile.on("change", function(e){
		var files = e.target.files;
		processFiles(files);
	});

	dropTarget.on("dragover", function(e){
		e.preventDefault();
		return false;
	});

	dropTarget.on("dragenter", function(e){
		$(e.target).addClass("drag-over");
	});

	dropTarget.on("dragleave", function(e){
		$(e.target).removeClass("drag-over");
	});

	dropTarget.on("drop", function(e){
		e.stopPropagation();
		e.preventDefault();

		var files = e.originalEvent.dataTransfer.files;
		
		processFiles(files);

		return false;
	});

	dropTarget.on("dragend", function(e){
		$(e.target).removeClass("drag-over");
	});
	
	function processFiles(files){
		if(!files || !files[0]){
			return
		}

		var file = files && files[0];
		parseFile(file).then(function(html){
			var bookmarks = parseHTML(html),
				enex = generateEnex(bookmarks),
				filename = file.name+".enex",
				outFile = generateDataURL(enex, filename);
			
			addDownloadLink(outFile, filename);
		}).catch(function(e){
			console.error(e.stack);
		});
	}
	
	function parseFile(file){
		var fileReader = new FileReader();
		return new Promise(function(resolve, reject){
			fileReader.onload = function(e){
				resolve(e.target.result);
			};
		
			fileReader.readAsText(file);
		});
	}
	
	function parseHTML(html){
		var doc = $(html),
			bookmarks = doc.find("a").map(function(i,a){
				var $a = $(a),
					url = $a.attr("href")
					title = ($a.text() || url).replace(/[^a-z1-9.-_:\/\\ ]/g, ""),
					created = ($a.attr("ADD_DATE")*1000) || Date.now();
				return {url: url, title: title, created: formatDate(new Date(created))};
			});
		return bookmarks;
	}
	
	function generateEnex(bookmarks){
		var doc = $($.parseXML(riot.render(enexTemplate, {created: formatDate(new Date())}))),
			elem = doc.find("en-export");
		bookmarks.each(function(i, note){
			var fragment = riot.render(enexNoteTemplate, note);
			try {
				elem.append(fragment);
			} catch (e){
				console.log(fragment);
			}
		});
		return doc[0];
	}
	
	function generateDataURL(enex){
		var xmlSerializer = new XMLSerializer(),
			xmlString = xmlSerializer.serializeToString(enex);
			blob = new Blob([xmlString], {type: 'text/xml'}),
			uri = URL.createObjectURL(blob);
		return uri;
	}
	
	function addDownloadLink(link, title){
		if(!linkList){
			linkList = $('<ul>').appendTo('.container');
		}
		var item = $('<li><a download="'+title+'" href="'+link+'">'+(title||link)+'</a>');
		item.find("a")[0].download = title;
		linkList.append(item);
	}

	function pad(number) {
		var r = String(number);
		if ( r.length === 1 ) {
			r = '0' + r;
		}
		return r;
	}

	function formatDate(date){
		return date.getUTCFullYear()
			+ '' + pad( date.getUTCMonth() + 1 )
			+ '' + pad( date.getUTCDate() )
			+ 'T' + pad( date.getUTCHours() )
			+ '' + pad( date.getUTCMinutes() )
			+ '' + pad( date.getUTCSeconds() )
			+ 'Z';
    }
});
