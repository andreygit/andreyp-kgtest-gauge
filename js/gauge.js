var gauge = function(parent){
  this.parent = parent;
  this.gaugeValue = 0;
  this.arrowLength = 170;
  this.labelMargin = 5;
  this.tickMargin = 15;
  this.tickSize = 5;
  this.startAngle = 180 - 30;
  this.endAngle = 360 + 30;
  this.gaugeThick = 3;
  this.drawn = false;
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

  function arc(innerRadius , outerRadius, startAngle , endAngle) {
    cw = startAngle > endAngle ? 0 : 1;
    path = [];
    // Ensure that the outer radius is always larger than the inner radius.
    if (outerRadius < innerRadius) rc = outerRadius, outerRadius = innerRadius, innerRadius = rc;
    
    x0 = outerRadius * Math.cos(startAngle);
    y0 = outerRadius * Math.sin(startAngle);
    x1 = outerRadius * Math.cos(endAngle);
    y1 = outerRadius * Math.sin(endAngle);

    // Detect whether the outer corners are collapsed.
    var l1 = Math.abs(endAngle - startAngle ) <= Math.PI ? 0 : 1;
   
    // Compute the two inner corners.
    x2 = innerRadius * Math.cos(endAngle);
    y2 = innerRadius * Math.sin(endAngle);
    x3 = innerRadius * Math.cos(startAngle);
    y3 = innerRadius * Math.sin(startAngle);

    // Detect whether the inner corners are collapsed.
    var l0 = Math.abs(startAngle - endAngle ) <= Math.PI ? 0 : 1;
    
    // Compute straight corners.
    path.push("M", x0, ",", y0);
    if (x1 != null) path.push("A", outerRadius, ",", outerRadius, " 0 ", l1, ",", cw, " ", x1, ",", y1);
    path.push("L", x2, ",", y2);
    if (x3 != null) path.push("A", innerRadius, ",", innerRadius, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
   
    path.push("Z");
   
    return path.join("");
  };

  function tickLine(innerRadius , outerRadius, startAngle) {
    // Compute the two inner  corner.
    x0 = innerRadius * Math.cos(startAngle);
    y0 = innerRadius * Math.sin(startAngle);
   
    // Compute the two outer corner.
    x2 = outerRadius * Math.cos(startAngle);
    y2 = outerRadius * Math.sin(startAngle);

    return "M" + x0 + "," + y0 + "L" + x2 + "," + y2;
  };

  function tickText(innerRadius ,  startAngle) {
    var x0,
        y0;
    x0 = innerRadius * Math.cos(startAngle);
    y0 = innerRadius * Math.sin(startAngle);    
    return {x: x0, y: y0}
  };

  this.setOptions = function (settings){
    this.setGaugeRadius(settings.gaugeRadius);
    this.setGaugeThick(settings.gaugeThick);
    this.setArrowLength(settings.arrowLength);
    this.setStartAngle(settings.startAngle);
    this.setEndAngle(settings.endAngle) ;
    this.setTickSize(settings.tickSize);
    this.setTickMargin(settings.tickMargin);
    this.setLabelMargin(settings.labelMargin);
    this.setColorScales(settings.colorScales);
    this.setColorValues(settings.colorValues);
    this.setLabels(settings.labels);
    this.setValue(settings.gaugeValue);
    return this;
  };

  this.setColorScales = function(items){
    this.data.colorScales =[];
    for(i in items){
      this.data.colorScales.push(items[i]/100);
    }
    return this;
  };

  this.setColorValues = function(items){
    this.data.colors =[];
    for(i in items){
      this.data.colors.push(items[i]);
    }
    return this;
  };

  this.setLabels = function(items){
    this.data.labels =[];
    for(i in items){
      this.data.labels.push(items[i]);
    }
    return this;
  };

  this.setValue = function(value) {
    this.gaugeValue = value/100;
    if (this.arrow != null){
      this.arrow.setAttribute('transform','rotate('+(this.startAngle + (this.endAngle - this.startAngle)*this.gaugeValue)+')');
    }
    return this;
  };
    
  this.setGaugeRadius = function(r){
    this.gaugeRadius = r;
    return this;
  };

  this.setTickSize = function(s){
    this.tickSize = s;
    return this;
  };

  this.setLabelMargin = function(padding){
    this.labelMargin  = padding;
    return this;
  };

  this.setTickMargin = function(padding){
    this.tickMargin  = padding;
    return this;
  };

  this.setStartAngle = function(a){
    this.startAngle  = a;
    return this;
  };

  this.setEndAngle = function(a){
    this.endAngle  = a;
    return this;
  };

  this.setArrowLength = function(al){
    this.arrowLength = al;
    return this;
  };

  this.setGaugeThick = function(t){
    this.gaugeThick = t;
    return this;
  };

  this.render = function(){
    var rad=(Math.PI/180);
   
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null,'class', 'gauge');

    var g1 = document.createElementNS(svgNS,"g");       
    this.parent.appendChild(svg);
    
    arrowThick = 5;
    arrowBaseRad = 10;

    svg.appendChild(g1);

    angleFrom =this.startAngle* rad;
    angleTo = this.endAngle* rad;
    width = 300;
    height = 300;
    len = (angleTo - angleFrom);
    k = this.data.colorScales.length/ len;
   
    for (i =1 ; i < this.data.colorScales.length; i++){
      d = arc( this.gaugeRadius-this.gaugeThick,this.gaugeRadius,angleFrom  + len*this.data.colorScales[i-1] ,angleFrom + len*this.data.colorScales[i]);
      arcEl = document.createElementNS(svgNS,"path");
      arcEl.setAttribute('d', d);
      arcEl.style.fill = this.data.colors[i-1];
      g1.appendChild(arcEl);
    }

    total = this.data.labels.length - 1;
    k = (total+1)/len;

    for (i =0 ; i < this.data.labels.length; i++){
      angle = angleFrom + len*(i/total);
      d = tickLine( this.gaugeRadius + this.tickMargin, this.gaugeRadius+this.tickMargin+this.tickSize, angle);
      lineEl = document.createElementNS(svgNS,"path");
      lineEl.setAttribute('d', d);
      lineEl.setAttribute('class','gauge-tick');
      g1.appendChild(lineEl);

      _tickText = tickText(this.gaugeRadius +this.tickMargin+ this.tickSize, angleFrom + len*(i/total));
      textEl = document.createElementNS(svgNS,"text");
      textEl.setAttribute('d', d);
      textEl.setAttribute('x', _tickText.x);
      textEl.setAttribute('y', _tickText.y);
      textEl.textContent = this.data.labels[i];
      textEl.setAttribute('class','gauge-label');
      
      g1.appendChild(textEl);
      var w = textEl.getComputedTextLength();
      var h = textEl.getBBox().height;
      _tickText = tickText(this.gaugeRadius  +this.tickMargin +  this.labelMargin+this.tickSize, angleFrom + len*(i/total));
    
      delta = rad*10;
      if (this.tickSize >0 ){
        textEl.setAttribute('x', _tickText.x - w/2 + (w/2) *Math.cos(angle) ) ;
        textEl.setAttribute('y', _tickText.y + h *(1+Math.sin(angle))/4) ;
      }else{
        textEl.setAttribute('x', _tickText.x - w/2 - (w/2) *Math.cos(angle) ) ;
        textEl.setAttribute('y', _tickText.y - (h) *Math.sin(angle) ) ;
      }
    }
    
    circleEl = document.createElementNS(svgNS,"circle");
    circleEl.setAttribute('cx', '0');
    circleEl.setAttribute('cy', '0');
    circleEl.setAttribute('r', arrowBaseRad);
    circleEl.setAttribute('class','gauge-arrow');
    g1.appendChild(circleEl);

    arrowEl = this.arrow = document.createElementNS(svgNS,"path");
    arrowEl.setAttribute('d', 'M0,'+arrowThick+'L'+this.arrowLength+',0L0,-'+arrowThick);
    arrowEl.setAttribute('class','gauge-arrow');
    arrowEl.setAttribute('transform','rotate('+(this.startAngle + (this.endAngle - this.startAngle)*this.gaugeValue)+')');
    g1.appendChild(arrowEl);
 
    rect = g1.getBBox();
    svgRect = svg.getBBox();
    cw = svg.clientWidth || svg.getBoundingClientRect().width;
    ch = svg.clientHeight || svg.getBoundingClientRect().height;

    g1.setAttribute("transform", "translate("+ ( cw/2 - rect.x - rect.width/2)  + "," +   (ch/2-rect.y- rect.height/2 ) + ")");  
    this.drawn = true;

    return this;
  }
  
};

if (window.jQuery) { 
  (function ( $ ) {
    $.fn.jqgauge = function(options){
      var self = this;
      this.defaults = {
             gaugeRadius: 180,
             gaugeThick: 3,
             arrowLength: 175,
             startAngle: 180-30,
             endAngle:360+30,  
             tickSize:5,
             tickMargin:5,
             labelMargin:5,
             colorScales:[0,70,90, 100],
             colorValues:['#666666', '#ffa500', '#ff0000'],
             labels:['0','1','2','3','4','5','6','7','8','9','10'],
             gaugeValue:100
          }
      this.settings = $.extend( {}, this.defaults, options );

      this.each(function(){
        this.instance = new gauge(this).setOptions(self.settings).render();
      });

      return this;
     };

     $.fn.setValue = function(val){
      var self = this;
      self.settings.gaugeValue = val/100;
      this.each(function(){
        $(this).find('.gauge-arrow').attr('transform','rotate('+(self.settings.startAngle + (self.settings.endAngle - self.settings.startAngle)*self.settings.gaugeValue)+')');
        
      });
      
      return this; 
     }
               
  }( jQuery ));
}