const fs=require("fs");
function g(f){
  var h=fs.readFileSync("C:/appliancerepairneary/"+f,"utf8");
  var i=h.indexOf("<div class="content-body reveal">");
  var e=h.indexOf("<!-- Repeated side card",i);
  return h.substring(i,e).replace(/<[^>]+>/g," ").split(/[s]+/).join(" ").toLowerCase();
}
function shsim(a,b){
  var k=8;
  function sh(t){var w=t.split(" "),s={};for(var i=0;i<=w.length-k;i++)s[w.slice(i,i+k).join(" ")]=1;return s;}
  var sA=sh(a),sB=sh(b),kA=Object.keys(sA),kB=Object.keys(sB);
  if(kA.length===0||kB.length===0)return 0;
  var x=kA.filter(function(v){return sB[v]!==undefined;}).length;
  return x/(kA.length+kB.length-x);
}
var pairs=[
  ["stove-repair-toronto.html","oven-repair-toronto.html"],
  ["washer-repair-toronto.html","washer-repair-mississauga.html"],
  ["washer-repair-oakville.html","washer-repair-oshawa.html"],
  ["fridge-repair-vaughan.html","fridge-repair-brampton.html"],
  ["dishwasher-repair-markham.html","dishwasher-repair-scarborough.html"],
  ["dryer-repair-etobicoke.html","dryer-repair-north-york.html"]
];
pairs.forEach(function(p){
  var sim=shsim(g(p[0]),g(p[1]));
  console.log(p[0]+" vs "+p[1]);
  console.log("  Similarity: "+(sim*100).toFixed(1)+"%   Uniqueness: "+(100-sim*100).toFixed(1)+"%");
});
