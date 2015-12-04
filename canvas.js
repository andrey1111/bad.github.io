function transformImage(currPx){

	r = currPx[0];
	g = currPx[1];
	b = currPx[2];
	a = currPx[3];
	
	new_r = 0;
	new_g = 0;
	new_b = 0;
	
//градация серого
/* */
	avg = 0.3  * r + 0.59 * g + 0.11 * b;
	new_r = avg;
	new_g = avg;
	new_b = avg;


//сепия
/*
	avg = 0.3  * r + 0.59 * g + 0.11 * b;
	new_r = avg + 100;
	new_g = avg + 50;
	new_b = avg + 0;
*/
	
//негатив
/*
	new_r = 255 - r;
	new_g = 255 - g;
	new_b = 255 - b;
*/

//бинаризация
/*	
	if( r + g + b > 383 ){
		new_r = 255;
		new_g = 255;
		new_b = 255;
	}
	else{
		new_r = 0;
		new_g = 0;
		new_b = 0;
	};
*/

//трансформация	
	currPx[0] = new_r;
	currPx[1] = new_g;
	currPx[2] = new_b;
	//currPx[3] = currPx[3] / 1.3;
	
	return currPx;
	
};
function getPixel(pixelData, w, h, x, y){
	currPx = [ pixelData[x*4+y*4*w+0], pixelData[x*4+y*4*w+1], pixelData[x*4+y*4*w+2], pixelData[x*4+y*4*w+3] ];
	newPx = transformImage( currPx );
	pixelData[x*4+y*4*w+0] = newPx[0];
	pixelData[x*4+y*4*w+1] = newPx[1];
	pixelData[x*4+y*4*w+2] = newPx[2];
	pixelData[x*4+y*4*w+3] = newPx[3];
};
function head(pixelData, w, h){
	getPixel(pixelData, w, h, 0, 0);/*head*/
};
function body(pixelData, w, h, n){
	for(var i = 1; i < n; i ++){
		if(n < h){
			getPixel(pixelData, w, h, i, n);
		};
		if(n < w){
			getPixel(pixelData, w, h, n, i);
		};
	};
};
function tail(pixelData, w, h, n){
	if(n < h){
		getPixel(pixelData, w, h, 0, n);
	};
	if(n < w){
		getPixel(pixelData, w, h, n, 0);
	};
	if(n < w && n < h){
		getPixel(pixelData, w, h, n, n);
	};
};
function setArray(w, h, imageData){
	var pixelData = imageData.data;
	head(pixelData, w, h);
	tail(pixelData, w, h, 1);
	for(var j = 2, count = Math.max(w, h); j < count; j ++){
		//break;
		body(pixelData, w, h, j);
		tail(pixelData, w, h, j);
	};
	for(var j = 0; j < pixelData.length; j += 4){
		break;
		currPx = [ pixelData[j], pixelData[j+1], pixelData[j+2], pixelData[j+3] ];
		newPx = transformImage( currPx );
		//изменим значение пикселей в массиве
		pixelData[j] = newPx[0];
		pixelData[j+1] = newPx[0+1];
		pixelData[j+2] = newPx[0+2];
		pixelData[j+3] = newPx[0+3];
	};
};
$(document).ready(
	function(){
		var canvas = document.getElementById("canvas");
		if (canvas.getContext){
			//откроем холст
			var ctx = canvas.getContext("2d");
			//загрузка изображения на холст
			var i = new Image();
			i.onload = function(){
				var width = i.width;
				var height = i.height;
				canvas.width = width;
			    canvas.height = height;
			    ctx.drawImage(i, 0, 0, width, height);
			    //получим массив пикселей
			    var imageData = ctx.getImageData(0, 0, width, height);
				setArray(width, height, imageData);
				//поместим в холст новый массив пикселей
 				ctx.putImageData(imageData, 0, 0);
			};
			//оригинальная картинка
			//i.src = './img/0SFL6733_platie/0SFL6733_platie_1.jpg';//'./img/0FOF6735_platie/0FOF6735_platie_1.jpg';//
			i.src = $('#img-cont>img').attr('src');
			document.getElementById('canvas').addEventListener('click', function(event){
			    		//получим массив пикселей
						var width = i.width;
						var height = i.height;
						var imageData = ctx.getImageData(0, 0, width, height);
						var pixelData = imageData.data;
						var x = event.offsetX;
						var y = event.offsetY;
						var currPx = width * y + x;
						var r = pixelData[currPx*4];
						var g = pixelData[currPx*4+1];
						var b = pixelData[currPx*4+2];
						var a = pixelData[currPx*4+3];
						var avg = 0.3  * r + 0.59 * g + 0.11 * b;
						//console.log( currPx );
						console.log( ' r ' + pixelData[currPx*4] + ' g ' + pixelData[currPx*4+1] +' b ' + pixelData[currPx*4+2] );
						//console.log( ' r ' + r + ' g ' + g +' b ' + b + ' avg ' + avg );
						//console.log( event.offsetX + 'x' + event.offsetY );
						console.log( 'x: '+x+' y: '+y+' avg: '+avg);
						
					}, false);
		};
		//var sql = window.SQL;
		//var db = new sql.Database();
		//sqlstr = "CREATE TABLE hello (a int, b char);";
		//sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
		//sqlstr += "INSERT INTO hello VALUES (1, 'world');"
		//db.run(sqlstr);
		//var res = db.exec("SELECT * FROM hello");
		/*
		[
    		{columns:['a','b'], values:[[0,'hello'],[1,'world']]}
		]
		*/

		// Prepare an sql statement
		//var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

		// Bind values to the parameters and fetch the results of the query
		//var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
		//console.log(result); // Will print {a:1, b:'world'}
		
		//var xhr = new XMLHttpRequest();
		//xhr.open('GET', 'file:///home/andrey1111/Documents/canvas/firstSQL', true);
		//xhr.responseType = 'arraybuffer';

		//xhr.onload = function(e) {
		//  var uInt8Array = new Uint8Array(xhr.response);
		//  var db = new SQL.Database(uInt8Array);
		//  db.run("INSERT INTO firstTable VALUES (?,?), (?,?)", [2,'second',3,'third']);
		//  var res = db.exec("SELECT * FROM firstTable");
		//  console.log(res);
		//};
		//xhr.send('file:///home/andrey1111/Documents/canvas/firstSQL');													
	}
);