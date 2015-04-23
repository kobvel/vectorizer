var history = {
  redo_list: [],
  undo_list: [],
  saveState: function(canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if (!keep_redo) {
      this.redo_list = [];
    }

    (list || this.undo_list).push(canvas.toDataURL());
  },
  undo: function(canvas, ctx) {
    this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
  },
  redo: function(canvas, ctx) {
    this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
  },
  restoreState: function(canvas, ctx, pop, push) {
    if (pop.length) {
      this.saveState(canvas, push, true);
      var restore_state = pop.pop();
      console.log(restore_state);
      var img = new Element('img', {
        'src': restore_state
      });
      img.onload = function() {
        ctx.clearRect(0, 0, 600, 400);
        ctx.drawImage(img, 0, 0, 600, 400, 0, 0, 600, 400);
      }
    }
  }
}

var pencil = {
  options: {
    stroke_color: ['00', '00', '00'],
    dim: 25
  },
  init: function() {
    this.canvas = Stage.element.find('canvas:nth-child(3)');;
    this.canvas_coords = this.canvas.getCoordinates();
    this.ctx = canvas[0].getContext('2d');
    this.ctx.strokeColor = this.options.stroke_color;
    this.drawing = false;
    this.addCanvasEvents();
  },
  addCanvasEvents: function() {
    this.canvas.bind('mousedown', downHandler);
    this.canvas.bind('mousemove', moveHandler);
    this.canvas.bind('mouseup', upHandler);
    this.canvas.bind('mouseleave', leaveHandler);
  },
  start: function(evt) {
    var x = evt.page.x - this.canvas_coords.left;
    var y = evt.page.y - this.canvas_coords.top;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    history.saveState(this.canvas);
    this.drawing = true;
  },
  stroke: function(evt) {
    if (this.drawing) {
      var x = evt.page.x - this.canvas_coords.left;
      var y = evt.page.y - this.canvas_coords.top;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

    }
  },
  stop: function(evt) {
    if (this.drawing) this.drawing = false;
  }
};

$('pencil').addEvent('click', function() {
  pencil.init();
});

$('undo').addEvent('click', function() {
  history.undo(canvas, ctx);
});

$('redo').addEvent('click', function() {
  history.redo(canvas, ctx);
});