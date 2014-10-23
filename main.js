enchant();

gsettings = {                 
  width:320
    ,height:320
    ,fps:10
};

var BLOCKS = [
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

  var stage, game, blockMap= [];

  blockMapSettings = {
    width:320
      ,height:320
      ,matrix: blockMap 
      ,color: "gray"
      ,blockMapWidth: 10
      ,blockMapHeight: 20
  }

blockSettings = {
  width: 100
    ,height: 100
    ,matrix: BLOCKS[random(BLOCKS.length)]
    ,color: BLOCK_COLORS[random(BLOCK_COLORS.length)]
    ,blockSize: gsettings.height / blockMapSettings.blockMapHeight
    ,speed: 16
}


var eSprite = Class.create(Sprite,{
  initialize:function(assets,image){
    Sprite.call(this,assets.width,assets.height);
    this.image = image;
    this.mapHeight = blockMapSettings.blockMapHeight;
    this.mapWidth = blockMapSettings.blockMapWidth;
    this.speed = assets.speed;
    this.blockSize = assets.blockSize;
    this.matrix = assets.matrix;
    this.color = assets.color;
    this.center = game.width / 4 - this.blockSize;
    this.x = this.center;
    stage.addChild(this);
  },
  onenterframe:function(){
    if(game.input.up && this.matrix != blockMap){
      if(this.check(blockMap, this.rotate(this.matrix), this.x / this.blockSize, this.y / this.blockSize)){
        this.matrix = this.rotate(this.matrix);
        this.image.context.clearRect(0, 0, this.image.width, this.image.height); //前のブロック領域を削除
      }
    }

    if(game.input.left && isBlock(this.matrix)){
      if(this.check(blockMap, this.matrix, (this.x - this.blockSize) / this.blockSize, this.y / this.blockSize)){
        this.x -= this.speed;
      }
    }

    if(game.input.right && isBlock(this.matrix)){
      if(this.check(blockMap, this.matrix, (this.x + this.blockSize) / this.blockSize, this.y / this.blockSize)){
        this.x += this.speed;
      }
    }

    if(game.input.down && isBlock(this.matrix)){
      var y = this.y / this.blockSize;
      while(this.check(blockMap, this.matrix, this.x / this.blockSize, y)){
        y++;
      }
      this.y = y * this.blockSize - this.blockSize;
    }

    if(isBlock(this.matrix) && this.age % game.fps == 0){
      if(this.check(blockMap, this.matrix, this.x / this.blockSize, (this.y + this.blockSize) / this.blockSize)){
        this.y += this.speed;
      } else {
        //blockMap配列にマージしてリセット処理
        this.mergeMatrix(blockMap, this.matrix, this.x / this.blockSize, this.y / this.blockSize);
        this.y = 0;
        this.x = this.center;
        this.image.context.clearRect(0, 0, this.image.width, this.image.height); //前のブロック領域を削除
        this.matrix = BLOCKS[random(BLOCKS.length)];
        this.color = BLOCK_COLORS[random(BLOCK_COLORS.length)];
      }
    }

    this.image.paintMatrix(this.matrix, this.color);
  },
  check:function(map, block, offsetx, offsety){
    if (offsetx < 0 || offsety < 0 ||
        this.mapHeight < offsety + block.length ||
        this.mapWidth  < offsetx + block[0].length) {
      return false;
    }
    for (var y = 0; y < block.length; y ++) {
      for (var x = 0; x < block[y].length; x ++) {
        if (block[y][x] && map[y + offsety][x + offsetx]) { 
          return false;
        }
      }
    }
    return true;
  },
  rotate:function(block){ //ブロックを回転
    var rotated = [];
    for (var x = 0; x < block[0].length; x++) {
      rotated[x] = [];
      for (var y = 0; y < block.length; y++) {
        rotated[x][block.length - y - 1] = block[y][x];
      }
    }
    return rotated;
  },
  mergeMatrix:function(map, block, offsetx, offsety){
    for (var y = 0; y < this.mapHeight; y ++) {
      for (var x = 0; x < this.mapWidth; x ++) {
        if (block[y - offsety] && block[y - offsety][x - offsetx]) {
          map[y][x]++;
        }
      }
    }
  }
});

var eSurface = Class.create(Surface,{
  initialize:function(assets){
    Surface.call(this,assets.width,assets.height);
  },
  paintMatrix:function(matrix, color){ //ブロックを描画
    this.context.fillStyle = color;
    this.context.strokeStyle = "black";
    for(y = 0; y < matrix.length; y++){
      for(x = 0; x < matrix[y].length; x++){
        if(matrix[y][x]){
          this.context.strokeRect(x * blockSettings.blockSize, y * blockSettings.blockSize, blockSettings.blockSize, blockSettings.blockSize);
          this.context.fillRect(x * blockSettings.blockSize, y * blockSettings.blockSize, blockSettings.blockSize, blockSettings.blockSize);
        }
      }
    }
  }
});

function initGame(){
  game = new Core(gsettings.width,gsettings.height);
  game.fps = gsettings.fps;
  stage = game.rootScene; 

  //blockMap配列の初期化
  for (var y = 0; y < blockMapSettings.blockMapHeight; y++) {
    blockMap[y] = [];
    for (var x = 0; x < blockMapSettings.blockMapWidth; x++) {
      blockMap[y][x] = 0;
    }
  }
}

function random(size){
  return Math.floor(Math.random() * size);
}

function isBlock(block){
  if(block != blockMap){
    return true;
  }
  return false;
}

function createFrame(){

}

window.onload = function(){
  initGame();
  game.onload=function(){
    var blockSurface = new eSurface(blockSettings);
    var blockSprite = new eSprite(blockSettings,blockSurface);
    var blockMapSurface = new eSurface(blockMapSettings);
    var blockMapSprite = new eSprite(blockMapSettings, blockMapSurface);


    //フレーム生成
    var borderLine = new Surface(gsettings.width, gsettings.height);
    var frame = new Sprite(gsettings.width, gsettings.height);
    borderLine.context.strokeRect(0,0,this.width / 2, this.height);
    frame.image = borderLine;
    stage.addChild(frame);
  };
  game.start();
};
