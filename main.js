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

var BLOCK_COLORS = [
  "red", "yellow", "magenta", "green", "blue", "orange", "cyan"
];
  gsettings = {                 
    width:320
      ,height:320
      ,fps:10
      ,blockMapWidth: 10
      ,blockMapHeight: 20
  };

var stage, game, blockSprite, blockSurface, posx = 0, posy = 0, blockMap;
var block = blocks[random(blocks.length)], blockColor = BLOCK_COLORS[random(BLOCK_COLORS.length)];
var BLOCK_SIZE = gsettings.height / gsettings.blockMapHeight;

var BlockSprite = Class.create(Sprite,{
  initialize:function(width,height,image){
    Sprite.call(this,width,height);
    this.image = image;
    this.x = 100;
    stage.addChild(this);
  },
  onenterframe:function(){
    if(game.input.up){
      block = blockSurface.rotate(block);
      //前のブロック領域を削除
      blockSurface.context.clearRect(0, 0, blockSurface.width, blockSurface.height);
    }
    blockSurface.paintMatrix(block, blockColor);
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
          if(matrix[y][x]){
            this.context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    },
    rotate:function(block){
      var rotated = [];
      for (var x = 0; x < block[0].length; x++) {
        rotated[x] = [];
        for (var y = 0; y < block.length; y++) {
          rotated[x][block.length - y - 1] = block[y][x];
        }
      }
      return rotated;
    }
});

function initGame(){
  game = new Core(gsettings.width,gsettings.height);
  game.fps = gsettings.fps;
  stage = game.rootScene; 

  blockMap = [];
  for (var y = 0; y < gsettings.blockMapHeight; y++) {
    blockMap[y] = [];
    for (var x = 0; x < gsettings.blockMapWidth; x++) {
      blockMap[y][x] = 0;
    }
  }
}

window.onload = function(){
  initGame();
  game.onload=function(){
    blockSurface = new Block(100,100);
    blockSprite = new BlockSprite(100,100,blockSurface);
  };
  game.start();
};

function random(size){
  return Math.floor(Math.random() * size);
}


