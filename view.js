document.createSvg = function(tagName) {
    var svgNS = "http://www.w3.org/2000/svg";
    return this.createElementNS(svgNS, tagName);
};
var svg = document.createSvg("svg");
// var numberPerSide = 20;
// var size = 10;
// var pixelsPerSide = 400;


var grid = function(x, y, size, pixelsPerSide, colors) {
    svg.setAttribute("width", pixelsPerSide);
    svg.setAttribute("height", pixelsPerSide);
    svg.setAttribute("viewBox", [0, 0, x * size, y * size].join(" "));

    for(var i = 0; i < x; i++) { // x
        for(var j = 0; j < y; j++) { // y

          var color1 = colors[(i+j) % colors.length];
          var color2 = colors[(i+j+1) % colors.length];  
          if (color1 == color2 && color1 != 'black') color2 = 'black';
          else if (color1 == color2) color2 = 'white';
          var g = document.createSvg("g");
          g.setAttribute("transform", ["translate(", i*size, ",", j*size, ")"].join(""));
          var number = y * i + j;
          var box = document.createSvg("rect");
          box.setAttribute("actorCount", 0);
          box.setAttribute("width", size);
          box.setAttribute("height", size);
          box.setAttribute("fill", color1);
          box.setAttribute("id", "b" + number);
          box.setAttribute("xpos", i);
          box.setAttribute("ypos", j);
          g.appendChild(box);
          var text = document.createSvg("text");
          text.innerHTML = '';
          text.setAttribute("fill", color2);
          text.setAttribute("font-size", 6);
          text.setAttribute("x", size / 2);
          text.setAttribute("y", size - 3);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute("xpos", i);
          text.setAttribute("ypos", j);
          text.setAttribute("id", "t" + number);

          var count = document.createSvg("text");
          count.innerHTML = '';
          count.setAttribute("fill", color2);
          count.setAttribute("font-size", 3);
          count.setAttribute("x", size - 2);
          count.setAttribute("y", size);
          count.setAttribute('count-anchor', 'start');
          var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
          svgimg.setAttributeNS(null,'height', size);
          svgimg.setAttributeNS(null,'width', size);
          svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', '');
          svgimg.setAttributeNS(null,'x','0');
          svgimg.setAttributeNS(null,'y','0');
          svgimg.setAttributeNS(null, 'visibility', 'visible');
          svgimg.setAttributeNS(null, "xpos", i);
          svgimg.setAttributeNS(null, "ypos", j);
          g.appendChild(svgimg);
          g.appendChild(text);
          g.appendChild(count);
          svg.appendChild(g);
        }  
    }
    svg.addEventListener(
        "click",
        function(e){
            var id = e.target;//.id;
            console.log(id);
            if(id) {
                var x = id.getAttribute('xpos');
                var y = id.getAttribute('ypos')
                if (x && y)
                  alert(x + "," + y);
            }
        },
        false);
    return svg;
};

var container = document.getElementById("container");

// container.appendChild(grid(2, 2, 10, 600, ["tan", "brown"]));

// top left of board object is 0, 0
function placeActor(x, y, c, link) {
  var r = getElementAt(x, y);
  var child = r.children;
  var svgimg = child[1];
  var box = child[0];
  if (c == '' && !link) {
    box.setAttribute('actorCount', Number(box.getAttribute('actorCount')) - 2);
    if (box.getAttribute('actorCount') < 0) {
      child[2].innerHTML = '';
      svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', '');  
    }
  } else if (!link) {
    child[2].innerHTML = c;
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', '');
  } else if (link) {
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', link);
  }
  var cizzount = Number(box.getAttribute('actorCount')) + 1;
  box.setAttribute('actorCount', cizzount);
  showCount(box, child[3]);
}

function moveActor(x, y, newX, newY) {
  var r = getElementAt(x, y);
  var dest = getElementAt()
  var child = r.children;

  if (child[2].innerHTML == '') { // we move an image
    var link = child[1].getAttribute('href');
    if (link == '')
      return; 
    removeActor(x, y);
    placeActor(newX, newY, '', link);
  } else { // we move a character
    var c = child[2].innerHTML;
    removeActor(x, y);
    placeActor(newX, newY, c, '');
  }
}

function removeActor(x, y) {
  var r = getElementAt(x, y);
  var child = r.children;
  var box = child[0];
  placeActor(x, y, '', '');
}

function showCount(box, count) {
  var count123 = box.getAttribute('actorCount');
  if (count123 > 1) {
    count.innerHTML = count123;
  } else {
    count.innerHTML = '';
  }
}

placeActor(0, 0, 'a', 'https://marcelk.net/bookie/img/chesspieces/wikipedia/wK.png');
placeActor(0, 0, 'a', 'https://marcelk.net/bookie/img/chesspieces/wikipedia/wK.png');

function getElementAt(x, y) {
  for (var i = 0; i < svg.childNodes.length; i++) {
    var child = svg.childNodes[i];
    if (child.childNodes[0].getAttribute('xpos') == x && child.childNodes[0].getAttribute('ypos') == y) {
      return child;
    }
  }
  return null;
}