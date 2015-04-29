var gaugeMath = function(){

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

  function tickText(innerRadius ,  startAngle, text) {
    var x0,
        y0;
    x0 = innerRadius * Math.cos(startAngle);
    y0 = innerRadius * Math.sin(startAngle);    
    return {x: x0, y: y0}
  };

  this.setColorItems = function(items){

    return this;
  }
  this.setTextItems = function(items){
    
    return this;
  }
}


