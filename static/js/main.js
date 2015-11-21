$(document).ready(function () {
	var SelectedFile,
		socket = io.connect('http://localhost:' + window.location.port),
		fileReader,
		name,
		fileName;

	function showFileError(msg) {
		$('#file-error').show();
		$('#error-text').innerHTML(msg);
	}

	function FileChosen(evnt) {
	    SelectedFile = evnt.target.files[0];
	    fileName = SelectedFile.name.substr(0, SelectedFile.name.lastIndexOf('.')) || SelectedFile.name;
	    $('#file-name').val(fileName);
	}

	function StartUpload() {
		if (!$('#file-name').val()) {
			showFileError("Please provide a file name.");
			return;
		}

		if ($('#file-select').val()) {
			$('#file-error').hide();
			fileReader = new FileReader();
			name = $('#file-name').val();

			var Content = "<span id='name-area'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
		        Content += '<div id="progress-container"><div id="progress-bar"></div></div><span id="percent">0%</span>';
		        Content += "<span id='uploaded'> - <span id='mb'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";

		    $('#upload-progress').innerHTML(Content);

		    fileReader.onload = function (event) {
		    	socket.emit('Upload', {
		    		'name': name,
		    		Data: event.target.result
		    	});
		    }

		    socket.emit('Start', {
		    	'name': name,
		    	'size': SelectedFile.size
		    });
		}
		else {
			showFileError("Please select a file.");
			return;
		}
	}


	$('#file-error').hide();
	if(window.File && window.FileReader) { //These are the relevant HTML5 objects that we are going to use 
        $('#upload-button').click(StartUpload);  
        $('#file-select').change(FileChosen);
    }
    else {
        $('#user-clip-upload').innerHTML("Your Browser Doesn't Support The File API Please Update Your Browser");
    }
});