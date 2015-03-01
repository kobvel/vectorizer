(function() {
  var imageContainer = $('#image');
  var svgContainer = $('#svg');
  var fileInput = $('#file-upload')

  fileInput.on('change', function(event) {
    var fd = new FormData;

    fd.append('image', this.files[0]);

    $.ajax({
      url: '/api/photo',
      type: 'POST',
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      success: function(data) {
        console.log(data);

        imageContainer.html($('<img src="' + data.image + '">'));
        svgContainer.html($('<img src="' + data.svg + '">'));

        fileInput.val('');
      }
    })

  })

})();