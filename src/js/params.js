var ctx, canvas;
var bgcolor = $('#color-preview-bg');
var flcolor = $('#color-preview-fill');
var fieldbgcolor = $('#color-code-bg');
var fieldfillcolor = $('#color-code-fill');

var sliderTurdsize = new Slider("#turdsize");
sliderTurdsize.on("slide", function(slideEvt) {
  $("#turdsizeSliderVal").val(slideEvt.value);
});

var sliderAlphamax = new Slider("#alphamax");
sliderAlphamax.on("slide", function(slideEvt) {
  $("#alphamaxSliderVal").val(slideEvt.value);
});

var sliderOpttolerance = new Slider("#opttolerance");
sliderOpttolerance.on("slide", function(slideEvt) {
  $("#opttoleranceSliderVal").val(slideEvt.value);
});



$('#selection')
  .change(function() {
    var str = "";
    $("#selection option:selected").each(function() {
      str = $(this).text();
    });
    $("#disabledInput").val(str);
  })
  .trigger("change");

$('#background-color').click(function(e) {
  pickColor(bgcolor, fieldbgcolor);
});
$('#fill-color').click(function(e) {
  pickColor(flcolor, fieldfillcolor);
});


function pickColor(preview, fieldinput) {
  if ($('#container > div > canvas:nth-child(1)').length > 0) {

    canvas = $('#container > div > canvas:nth-child(1)');
    ctx = canvas[0].getContext("2d");

    canvas.mousemove(function(e) {

      var canvasOffset = $(canvas).offset();
      var canvasX = Math.floor(e.pageX - canvasOffset.left);
      var canvasY = Math.floor(e.pageY - canvasOffset.top);
      var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
      var pixel = imageData.data;

      var pixelColor = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";
      preview.css('backgroundColor', pixelColor);

    });

    canvas.click(function(e) {
      var canvasOffset = $(canvas).offset();
      var canvasX = Math.floor(e.pageX - canvasOffset.left);
      var canvasY = Math.floor(e.pageY - canvasOffset.top);
      var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
      var pixel = imageData.data;

      var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
      fieldinput.val('#' + dColor.toString(16));
      canvas.unbind("click");
      canvas.unbind("mousemove");
    });
  }


}