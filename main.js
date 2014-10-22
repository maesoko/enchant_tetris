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


  gsettings = {                 
    width:320
      ,height:320
      ,fps:60
      ,mapWidth: 10
      ,mapHeight: 20
  };

var stage, game, blockSprite, blockSurface;
var block = blocks[random(blocks.length)];
var BLOCK_SIZE = gsettings.height / gsettings.mapHeight;
var posx = 0, posy = 0;

var BlockSprite = Class.create(Sprite,{
  initialize:function(width,height,image){
    Sprite.call(this,width,height);
    this.image = image;
    stage.addChild(this);
  },
    onenterframe:function(){
      blockSurface.paintMatrix(block, blockColors[random(blockColors.length)]);
    }
});

var Block = Class.create(Surface,{
  initialize:function(width,height){
    Surface.call(this,width,height);
  },//ブロックを描画
    paintMatrix:function(matrix, color){
      this.context.fillStyle = color; 
      for(y = 0; y < matrix.length; y++){
        for(x = 0; x < matrix[y].length; x++){
          if(block[y][x]){
            this.context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
    blockSurface = new Block(BLOCK_SIZE * block[0].length, BLOCK_SIZE * block.length);
    blockSprite = new BlockSprite(BLOCK_SIZE * block[0].length, BLOCK_SIZE * block.length, blockSurface);

  };
  game.start();
};

function random(size){
  return Math.floor(Math.random() * size);
}

var blockColors = [
"red", "yellow", "magenta", "green", "blue", "orange", "cyan"
];
