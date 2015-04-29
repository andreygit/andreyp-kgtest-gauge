var gauge = function(parent){


  function arc(innerRadius , outerRadius, startAngle , endAngle) {

    var r0 =innerRadius,
        r1 =outerRadius,
        a0 = startAngle ,
        a1 = endAngle,
        cw = a0 > a1 ? 0 : 1;

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
   
    var x0,
        y0,
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        path = [];

    // Compute the two outer corners.

      x0 = r1 * Math.cos(a0);
      y0 = r1 * Math.sin(a0);
      x1 = r1 * Math.cos(a1);
      y1 = r1 * Math.sin(a1);

      // Detect whether the outer corners are collapsed.
      var l1 = Math.abs(a1 - a0 ) <= Math.PI ? 0 : 1;
   
    // Compute the two inner corners.
      x2 = r0 * Math.cos(a1);
      y2 = r0 * Math.sin(a1);
      x3 = r0 * Math.cos(a0);
      y3 = r0 * Math.sin(a0);

      // Detect whether the inner corners are collapsed.
      var l0 = Math.abs(a0 - a1 ) <= Math.PI ? 0 : 1;
   
      // Compute straight corners.
      path.push("M", x0, ",", y0);
      if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
      path.push("L", x2, ",", y2);
      if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
     
      path.push("Z");

      
      return path.join("");
  };

  function tick(innerRadius , outerRadius, startAngle) {
    var x0,
        y0,
        x2,
        y2,
       
        path = [];
   
    // Compute the two inner  corner.
    x0 = innerRadius * Math.cos(startAngle);
    y0 = innerRadius * Math.sin(startAngle);
   

    // Compute the two outer corner.
    x2 = outerRadius * Math.cos(startAngle);
    y2 = outerRadius * Math.sin(startAngle);
    
    path.push("M", x0, ",", y0);
    path.push("L", x2, ",", y2);
   
    return path.join("");
  };

  this.data = {
    colors:[
      0x00ff0, 0x0000ff
    ],
    colorScales:[
      0, 50
    ],
    labels:[
      'a',
      'b',
      'c',
    ]
  };
  function tickText(innerRadius ,  startAngle) {
    var x0,
        y0;
    x0 = innerRadius * Math.cos(startAngle);
    y0 = innerRadius * Math.sin(startAngle);    
    return {x: x0, y: y0}
  };

  this.setColorScales = function(items){
    this.data.colorScales =[];
    for(i in items){
      this.data.colorScales.push(items[i]/100);
    }
    return this;
  }
  this.setColorValues = function(items){
    this.data.colors =[];
    for(i in items){
      this.data.colors.push(items[i]);
    }
    return this;
  }
  this.setLabels = function(items){
    this.data.labels =[];
    for(i in items){
      this.data.labels.push(items[i]);
    }
    return this;
  }

  this.render = function(){
    var rad=(Math.PI/180);
   
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null,'style', 'border: 1px solid black');
    svg.setAttributeNS(null,'class', 'gauge');

    var g1 = document.createElementNS(svgNS,"g");       
    
    parent.appendChild(svg);
    cw = svg.clientWidth;
    ch = svg.clientHeight;

    g1.setAttribute("transform", "translate(" +cw/2 + "," +cw/2 + ")");

    angleFrom = (180 - 30)* rad;
    angleTo = (360 + 30)* rad;
    width = 300;
    height = 300;
    len = (angleTo - angleFrom);
    k = this.data.colorScales.length/ len;
   
    for (i =1 ; i < this.data.colorScales.length; i++){
      d = arc(width/2-3,width/2,angleFrom + len*this.data.colorScales[i-1] ,angleFrom + len*this.data.colorScales[i]);
      arc1 = document.createElementNS(svgNS,"path");
      arc1.setAttribute('d', d);
      arc1.style.fill = this.data.colors[i-1];
      g1.appendChild(arc1);
    }

    total = this.data.labels.length - 1;
    k = (total+1)/len;

    for (i =0 ; i < this.data.labels.length; i++){
      
      d = tick(width/2, width/2+5,angleFrom + len*(i/total) );
      line2 = document.createElementNS(svgNS,"path");
      line2.setAttribute('d', d);
      line2.style.stroke = 'red';
      g1.appendChild(line2);

      _tickText = tickText(width/2+5, angleFrom + len*(i/total));
      text2 = document.createElementNS(svgNS,"text");
      text2.setAttribute('d', d);
      text2.setAttribute('x', _tickText.x);
      text2.setAttribute('y', _tickText.y);
      text2.textContent = this.data.labels[i];
      text2.style.fill = 'red';
      g1.appendChild(text2);
    }
    
    svg.appendChild(g1);

    console.log('drawn');
  }
  
  
}


