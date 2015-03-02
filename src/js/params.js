var sliderTurdsize = new Slider("#turdsize");
sliderTurdsize.on("slide", function(slideEvt) {
  $("#turdsizeSliderVal").val(slideEvt.value);
});

var sliderAlphamax = new Slider("#alphamax");
sliderAlphamax.on("slide", function(slideEvt) {
  $("#alphamaxSliderVal").val(slideEvt.value);
});

var sliderOpptolerance = new Slider("#opptolerance");
sliderOpptolerance.on("slide", function(slideEvt) {
  $("#opptoleranceSliderVal").val(slideEvt.value);
});