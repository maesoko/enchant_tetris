enchant();

var stage, game;

gsettings = {                 
    width:320
   ,height:320
   ,fps:15
};

window.onload = function(){

  game = new Core(gsettings.width,gsettings.height);
  stage = game.rootScene;     

  stage.backgroundColor = "blue"; 
  game.onload=function(){
  
  };
  game.start();
};
