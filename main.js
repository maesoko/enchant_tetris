enchant();

var stage, game;

gsettings = {                 
	width:320
		,height:320
		,fps:30
};

window.onload = function(){

	game = new Core(gsettings.width,gsettings.height);
	game.fps = gsettings.fps;
	stage = game.rootScene;     

	game.onload=function(){
		var sprite = new Sprite(100,100);
		var surface = new Surface(100,100);
		sprite.image = surface;

		sprite.x = 100;
		sprite.y = 100;
		context = surface.context;

		var matrix = blocks[Math.floor(Math.random() * blocks.length)];

		for(y = 0; y < matrix.length; y++){
			for(x = 0; x < matrix[y].length; x++){
				if(matrix[y][x]){
					//context.fillRect((x + 0) * 20, (y + 0) * 20, 20, 20);
					context.fillRect(x * 20, y * 20, x + 20, y + 20);
				}
			}
		}


		stage.addChild(sprite);
	};
	game.start();
};

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
