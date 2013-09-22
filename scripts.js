$(document).ready(function(){

	var canvas= $('#canvas1')[0],
	ctx,
	canWidth,
	canHeight,
	canMinX,
	canvasMaxX,
	selected = 0,
	drawing = false,
	chair = [], square = [], mic = [];
	var startX,
		startY;

	function init(){
		
		canWidth = canvas.width = 1000;
		canHeight = canvas.height = 700;
		canvasMinX = $('#canvas1').offset().left;
		canvasMaxX = canvasMinX + canWidth;
		canvasMinY = $('#canvas1').offset().top;
		canvasMaxY = canvasMinY + canHeight;


		ctx = canvas.getContext("2d");
	}

	function selectTool(){
		selected = $(this).data('tool');
		$(this).css('backgroundColor', '#ff0000').siblings().css('backgroundColor', '#c3c2c4');
	}

	function drawX(x, y){
		ctx.beginPath();
		ctx.moveTo(x - 7, y - 7);
		ctx.lineTo(x + 7, y + 7);
		ctx.stroke();

		ctx.moveTo(x + 7, y - 7);
		ctx.lineTo(x - 7, y + 7);
		ctx.stroke();

		chair.push([x, y]);
		
	}

	function drawSquare(x, y){
		ctx.strokeRect(x-15, y-15, 40, 40);

		square.push([x, y]);
		
	}

	function drawMic(x,y){
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, Math.PI*2, false);
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.stroke();

		ctx.moveTo(x,y);
		ctx.lineTo(x - 15, y + 20);
		ctx.stroke();

		mic.push([x, y]);

	}

	function drawText(x, y, val){
		ctx.fillStyle = "black";
		ctx.font = "8pt Helvetica";
		ctx.fillText(val, x, y);
	}

	function drawScreen(x, y){
		
		var negX,
			negY;

		if (!drawing){
			ctx.beginPath();
			startX = x;
			startY = y;
			ctx.moveTo(startX, startY);
			drawing=true;
			canvas.style.cursor="crosshair";
			
		}else{
			
			var screenLength = 80;
			var newPosX = x - startX;
			var newPosY = y - startY;

			if (newPosX < 0){ 
				negX = true; 
			}else{ 
				negX = false; 
			}
			if (newPosY < 0){ 
				negY = true; 
			}else{ 
				negY = false; 
			}

			var theta = newPosY/newPosX;

			theta = Math.atan(theta);
			theta = theta*180/Math.PI;

			var cosX = Math.cos(theta * (Math.PI/180));

			newPosX = cosX*screenLength;

			newPosX *= newPosX;

			screenLength*= screenLength;

			newPosY = screenLength - newPosX;

			newPosY = Math.sqrt(newPosY);
			newPosX = Math.sqrt(newPosX);

			(negX === true) ? newPosX *= -1: newPosX;
			(negY === true) ? newPosY *= -1: newPosY;

			

			ctx.lineTo(startX + newPosX, startY + newPosY);
			ctx.stroke();
			drawing=false;
			canvas.style.cursor="default";
		}
	}

	function click(e){
		if((e.pageX > canvasMinX && e.pageX < canvasMaxX)&&(e.pageY > canvasMinY && e.pageY < canvasMaxY)) {
			
			mouseX = e.pageX - canvasMinX;
			mouseY = e.pageY - canvasMinY;

			switch(selected)
			{

				case 0:
					alert('no tool selected');
					break;
				case 1:
					drawX(mouseX, mouseY);

					
					break;
				
				case 2:
					drawMic(mouseX, mouseY);
					break;
				
				case 3:
					drawSquare(mouseX,mouseY);
					break;

				case 4:
					var val = prompt("text?");
					drawText(mouseX, mouseY, val);
					break;

				case 5:
					drawScreen(mouseX,mouseY);
				
			}
			
		}
	}


	init();

	$('#toolSel li').mouseup(selectTool);
	$('#canvas1').mouseup(click);
});