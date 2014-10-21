enchant();

var blocks = [
[
[1,1],
  [0,1],
  [0,1]
  ],
  [
  [1,1],
  [1,0],
  [1,0]
  ],	
  [
  [1,1],
  [1,1]
  ],
  [
  [1,0],
  [1,1],
  [1,0]
  ],
  [
  [1,0],
  [1,1],
  [0,1]
  ],
  [
  [0,1],
  [1,1],
  [1,0]
  ],
  [
  [1],
  [1],
  [1],
  [1]
  ]
  ];

  var stage, game;

  gsettings = {                 
    width:320
      ,height:320
      ,fps:30
  };


var block = blocks[random(blocks.length)];
var posx = 0, posy = 0;
var MAP_WIDTH = 10, MAP_HEIGHT = 20;
var BLOCK_SIZE = gsettings.height / MAP_HEIGHT;

var eSurface = Class.create(Surface,{
  initialize:function(width,height){
    Surface.call(this,width,height);
  },//ブロックを描画
    paintMatrix:function(matrix, offsetx, offsety, color){
      this.context.fillStyle = color; 
      for(y = 0; y < matrix.length; y++){
        for(x = 0; x < matrix[y].length; x++){
          if(block[y][x]){
            var px = (x + offsetx) * BLOCK_SIZE;
            var py = (y + offsety) * BLOCK_SIZE;
            this.context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
});

window.onload = function(){

  game = new Core(gsettings.width,gsettings.height);
  game.fps = gsettings.fps;
  stage = game.rootScene;     

  game.onload=function(){
    var sprite = new Sprite(BLOCK_SIZE * block[0].length, BLOCK_SIZE * block.length);
    var surface = new eSurface(BLOCK_SIZE * block[0].length, BLOCK_SIZE * block.length);
    sprite.image = surface;
    sprite.x = posx;
    sprite.y = posy;
    sprite.backgroundColor = "black";
    surface.paintMatrix(block, posx, posy, blockColors[random(blockColors.length)]);
    stage.addChild(sprite);
  };
  game.start();
};

function random(size){
  return Math.floor(Math.random() * size);
}

var blockColors = [
"red", "yellow", "magenta", "green", "blue", "orange", "cyan"
];


