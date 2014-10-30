"use strict"

enchant();

var gsettings = {                 
  width:320,
  height:320,
  fps:10
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

var stage, game, blockMap = [], scoreLabel;

var blockMapSettings = {
  width:gsettings.width / 2,
  height:gsettings.height,
  matrix: blockMap ,
  color: "gray",
  blockMapWidth: 10,
  blockMapHeight: 20
};

var blockSettings = {
  width: 100,
  height: 100,
  matrix: BLOCKS[random(BLOCKS.length)],
  color: BLOCK_COLORS[random(BLOCK_COLORS.length)],
  blockSize: gsettings.height / blockMapSettings.blockMapHeight,
  score: 10
};

var padSettings = {
  x: gsettings.width - 100,
  y: gsettings.height - 100
};

var AbstractPaint = Class.create(Sprite,{
    initialize:function(){
      Sprite.call(this);
      this.blockSize = blockSettings.blockSize;
    },
    paintMatrix:function(matrix, color, blockSize, image){ //ブロックを描画
      this.width = image.width;
      this.height = image.height;
      image.context.clearRect(0, 0, image.width, image.height); //前のブロック領域を削除
      image.context.fillStyle = color;
      image.context.strokeStyle = "black";
      for(var y = 0; y < matrix.length; y++){
        for(var x = 0; x < matrix[y].length; x++){
          if(matrix[y][x]){
            image.context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
            image.context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          }
        }
      }
    }
});

var BlockMap = Class.create(AbstractPaint,{
    initialize:function(assets){
      AbstractPaint.call(this);
      this.image = new Surface(assets.width, assets.height);
      this.color = assets.color;
      stage.addChild(this);
    },
    onenterframe:function(){
      this.paintMatrix(blockMap, this.color, this.blockSize, this.image); //毎フレームごとにブロックを描画
    }
});

var Block = Class.create(AbstractPaint,{
    initialize:function(assets){
      AbstractPaint.call(this);
      this.image = new Surface(assets.width, assets.height);
      this.color = assets.color;
      this.matrix = assets.matrix;
      this.mapWidth = blockMapSettings.blockMapWidth;
      this.mapHeight = blockMapSettings.blockMapHeight;
      this.speed = assets.blockSize;
      this.score = assets.score;
      this.center = game.width / 4 - this.blockSize;
      this.x = this.center;
      this.y = 0;
      stage.addChild(this);
    },
    onenterframe:function(){
      this.posx = this.x / this.blockSize;
      this.posy = this.y / this.blockSize;
      this.gameOver(); //ゲームオーバー判定

      //上キー:回転処理
      if(game.input.up){
        if(this.check(blockMap, this.rotate(this.matrix), this.posx, this.posy)){
          this.matrix = this.rotate(this.matrix);
        }
      }

      //左キー:移動処理
      if(game.input.left){
        if(this.check(blockMap, this.matrix, this.posx - 1, this.posy)){
          this.x -= this.speed;
        }
      }

      //右キー:移動処理
      if(game.input.right){
        if(this.check(blockMap, this.matrix, this.posx + 1, this.posy)){
          this.x += this.speed;
        }
      }

      //下キー:落下処理
      if(game.input.down){
        var y = this.posy;
        while(this.check(blockMap, this.matrix, this.posx, y)){
          y++;
        }
        this.y = (y - 1) * this.blockSize;
      }

      //自動落下
      if(this.age % game.fps == 0){
        if(this.check(blockMap, this.matrix, this.posx, this.posy + 1)){
          this.y += this.speed;
        } else {
          this.mergeMatrix(blockMap, this.matrix, this.posx, this.posy); //blockMap配列にblock配列をマージ
          this.clearRows(blockMap); //1行埋まっていれば消去
          this.reset(); //座標等のリセット
        }
      }

      this.paintMatrix(this.matrix, this.color, this.blockSize, this.image); //毎フレームごとにブロックを描画
    },
    check:function(map, block, offsetx, offsety){ //ブロックの衝突判定
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
    mergeMatrix:function(map, block, offsetx, offsety){ //blockMap配列にblock配列を複製
      for (var y = 0; y < this.mapHeight; y ++) {
        for (var x = 0; x < this.mapWidth; x ++) {
          if (block[y - offsety] && block[y - offsety][x - offsetx]) {
            map[y][x]++;
          }
        }
      }
    },
    clearRows:function(map){ //埋まった行を消去
      for (var y = 0; y < this.mapHeight; y ++) {
        var full = true;
        for (var x = 0; x < this.mapWidth; x ++) {
          if (!map[y][x]) {
            full = false;
          }
        }
        if (full) {
          map.splice(y, 1);
          var newRow = [];
          for (var i = 0; i < this.mapWidth; i ++) {
            newRow[i] = 0;
          }
          map.unshift(newRow);
          scoreLabel.score += this.score; //消去した行数分スコアを加算
        }
      }
    },
    gameOver:function(){ //ゲームオーバー判定
      if(this.y == 0 && !this.check(blockMap, this.matrix, this.posx, this.posy)){
        this.paintMatrix(this.matrix, "gray", this.blockSize, this.image);
        game.end();
      }
      return;
    },
    reset:function(){ //座標を初期化、新しいブロックを再配置
      this.y = 0;
      this.x = this.center;
      this.matrix = BLOCKS[random(BLOCKS.length)];
      this.color = BLOCK_COLORS[random(BLOCK_COLORS.length)];
    }
});

var BorderLine = Class.create(Sprite,{
    initialize:function(width,height){
      Sprite.call(this,width,height);
      this.image = new Surface(width,height);
      this.image.context.strokeRect(0,0,this.width / 2, this.height);
      stage.addChild(this);
    }
});

var ePad = Class.create(Pad,{
    initialize:function(assets){
      Pad.call(this);
      this.moveTo(assets.x, assets.y);
      stage.addChild(this);
    }
});

function initGame(){ //初期化処理
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

function random(size){ //配列の長さに応じて乱数を返す
  return Math.floor(Math.random() * size);
}

window.onload = function(){
  initGame();
  game.onload=function(){
    //ブロック生成
    new Block(blockSettings);
    //ブロックマップを生成
    new BlockMap(blockMapSettings);
    //ボーダーライン生成
    new BorderLine(gsettings.width, gsettings.height);
    //仮想パッド表示
    new ePad(padSettings);
    //スコアラベル表示
    scoreLabel = new ScoreLabel(game.width / 2, 0);
    stage.addChild(scoreLabel);
  };
  game.start();
};
